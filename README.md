# Enclaver Website - enclaver.io

Our website, powered by the Hugo static site generator.

## Syncing Documentation

## Running Locally

```
$ docker build -t hugo .
$ docker run --rm -ti -p 1313:1313 hugo server --bind=0.0.0.0
```

Single line:

```
docker build -t hugo . && docker run --rm -ti -p 1313:1313 hugo server --bind=0.0.0.0 -D -F
```

With live-reload:

```
docker run --rm -ti -p 1313:1313 -v ${PWD}:/src:rw hugo server --bind=0.0.0.0 --disableFastRender
```
