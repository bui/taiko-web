# taiko-web
A web-based Taiko no Tatsujin simulator.

Running instance: [https://taiko.bui.pm](https://taiko.bui.pm)

Still in development. Works best with Chrome.

## Docker

If you'd like to save the work of set-up and run taiko-web in a docker container, run the following lines in shell.

Replace IMAGE_NAME and CONTAINER_NAME with the actual names you'd like to take.

``` {sh}
docker build -t IMAGE_NAME .
docker run --name CONTAINER_NAME -p 34801:34801 -p 34802:34802 -d IMAGE_NAME
```

Then visit localhost:34801 to start playing.

## Setup
Please see the [Setup](https://github.com/bui/taiko-web/wiki/Setup) page for setup instructions.
