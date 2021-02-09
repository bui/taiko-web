FROM mongo

RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:redislabs/redis
RUN apt-get update && apt-get install -y git python3-pip ffmpeg redis

COPY . /taiko-web
WORKDIR /taiko-web
RUN pip3 install -r requirements.txt

EXPOSE 34801
EXPOSE 34802

ENTRYPOINT \
    service redis-server start && \
    mongod --fork --syslog && \
    mongo taiko --eval 'db.users.findOneAndUpdate({username:"admin"},{$set:{user_level:100}})' && \
    mongoimport --db taiko --collection categories --file /taiko-web/tools/categories.json --jsonArray && \
    cd /taiko-web && \
    gunicorn -b 127.0.0.1:34801 app:app
