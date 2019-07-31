#!/usr/bin/env python2

from __future__ import division

import json
import sqlite3
import re
import os
from flask import Flask, g, jsonify, render_template, request, abort, redirect
from flask_caching import Cache
from ffmpy import FFmpeg

DATABASE = 'taiko.db'
DEFAULT_URL = 'https://github.com/bui/taiko-web/'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def get_config():
    if os.path.isfile('config.json'):
        try:
            config = json.load(open('config.json', 'r'))
        except ValueError:
            print('WARNING: Invalid config.json, using default values')
            config = {}
    else:
        print('WARNING: No config.json found, using default values')
        config = {}

    if not config.get('songs_baseurl'):
        config['songs_baseurl'] = ''.join([request.host_url, 'songs']) + '/'
    if not config.get('assets_baseurl'):
        config['assets_baseurl'] = ''.join([request.host_url, 'assets']) + '/'

    config['_version'] = get_version()
    return config


def get_version():
    version = {'commit': None, 'commit_short': '', 'version': None, 'url': DEFAULT_URL}
    if os.path.isfile('version.json'):
        try:
            ver = json.load(open('version.json', 'r'))
        except ValueError:
            print('Invalid version.json file')
            return version

        for key in version.keys():
            if ver.get(key):
                version[key] = ver.get(key)

    return version

app = Flask(__name__)
try:
    config = get_config()
    app.cache = Cache(app, config={
        'CACHE_TYPE': 'redis',
        'CACHE_REDIS_HOST': config['redis_host'],
        'CACHE_REDIS_PORT': config['redis_port'],
        'CACHE_REDIS_PASSWORD': config['redis_password'],
        'CACHE_REDIS_DB': config['redis_db']
    })
    print("redis enabled")
except RuntimeError:
    print("redis disabled")
    import tempfile
    app.cache = Cache(app, config={'CACHE_TYPE': 'filesystem', 'CACHE_DIR': tempfile.gettempdir()})

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/')
@app.cache.cached(timeout=15)
def route_index():
    version = get_version()
    return render_template('index.html', version=version, config=get_config())


@app.route('/api/preview')
@app.cache.cached(timeout=15)
def route_api_preview():
    song_id = request.args.get('id', None)
    if not song_id or not re.match('^[0-9]+$', song_id):
        abort(400)

    song_row = query_db('select * from songs where id = ? and enabled = 1', (song_id,))
    if not song_row:
        abort(400)

    song_type = song_row[0][12]
    prev_path = make_preview(song_id, song_type, song_row[0][15])
    if not prev_path:
        return redirect(get_config()['songs_baseurl'] + '%s/main.mp3' % song_id)

    return redirect(get_config()['songs_baseurl'] + '%s/preview.mp3' % song_id)


@app.route('/api/songs')
@app.cache.cached(timeout=15)
def route_api_songs():
    songs = query_db('select * from songs where enabled = 1')
    
    raw_categories = query_db('select * from categories')
    categories = {}
    for cat in raw_categories:
        categories[cat[0]] = cat[1]
    
    raw_song_skins = query_db('select * from song_skins')
    song_skins = {}
    for skin in raw_song_skins:
        song_skins[skin[0]] = {'name': skin[1], 'song': skin[2], 'stage': skin[3], 'don': skin[4]}
    
    songs_out = []
    for song in songs:
        song_id = song[0]
        song_type = song[12]
        preview = song[15]
        
        category_out = categories[song[11]] if song[11] in categories else ""
        song_skin_out = song_skins[song[14]] if song[14] in song_skins else None
        
        songs_out.append({
            'id': song_id,
            'title': song[1],
            'title_lang': song[2],
            'subtitle': song[3],
            'subtitle_lang': song[4],
            'stars': [
                song[5], song[6], song[7], song[8], song[9]
            ],
            'preview': preview,
            'category': category_out,
            'type': song_type,
            'offset': song[13],
            'song_skin': song_skin_out,
            'volume': song[16]
        })

    return jsonify(songs_out)


@app.route('/api/config')
@app.cache.cached(timeout=15)
def route_api_config():
    config = get_config()
    return jsonify(config)


def make_preview(song_id, song_type, preview):
    song_path = 'public/songs/%s/main.mp3' % song_id
    prev_path = 'public/songs/%s/preview.mp3' % song_id

    if os.path.isfile(song_path) and not os.path.isfile(prev_path):
        if not preview or preview <= 0:
            print('Skipping #%s due to no preview' % song_id)
            return False

        print('Making preview.mp3 for song #%s' % song_id)
        ff = FFmpeg(inputs={song_path: '-ss %s' % preview},
                    outputs={prev_path: '-codec:a libmp3lame -ar 32000 -b:a 92k -y -loglevel panic'})
        ff.run()

    return prev_path


if __name__ == '__main__':
    app.run(port=34801)
