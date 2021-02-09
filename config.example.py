# The full URL base asset URL, with trailing slash.
ASSETS_BASEURL = '/assets/'

# The full URL base song URL, with trailing slash.
SONGS_BASEURL = '/songs/'

# The email address to display in the "About Simulator" menu.
EMAIL = None

# Whether to use the user account system.
ACCOUNTS = True

# Custom JavaScript file to load with the simulator.
CUSTOM_JS = ''

# MongoDB server settings.
MONGO = {
    'host': ['127.0.0.1:27017'],
    'database': 'taiko'
}

# Redis server settings, used for sessions + cache.
REDIS = {
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_HOST': '127.0.0.1',
    'CACHE_REDIS_PORT': 6379,
    'CACHE_REDIS_PASSWORD': None,
    'CACHE_REDIS_DB': None
}

# Secret key used for sessions.
SECRET_KEY = 'change-me'

# Git repository base URL.
#URL = 'https://github.com/bui/taiko-web/'
URL = 'https://github.com/WHMHammer/taiko-web/'

# Google Drive API.
GOOGLE_CREDENTIALS = {
    'gdrive_enabled': False,
    'api_key': '',
    'oauth_client_id': '',
    'project_number': '',
    'min_level': None
}
