[Grafana](https://grafana.com) [![Circle CI](https://circleci.com/gh/grafana/grafana.svg?style=svg)](https://circleci.com/gh/grafana/grafana) [![Go Report Card](https://goreportcard.com/badge/github.com/grafana/grafana)](https://goreportcard.com/report/github.com/grafana/grafana)
================
[Website](https://grafana.com) |
[Twitter](https://twitter.com/grafana) |
[Community & Forum](https://community.grafana.com)

Grafana is an open source, feature rich metrics dashboard and graph editor for
Graphite, Elasticsearch, OpenTSDB, Prometheus and InfluxDB.

![](http://docs.grafana.org/assets/img/features/dashboard_ex1.png)

## Installation
Head to [docs.grafana.org](http://docs.grafana.org/installation/) and [download](https://grafana.com/get)
the latest release.

If you have any problems please read the [troubleshooting guide](http://docs.grafana.org/installation/troubleshooting/).

## Documentation & Support
Be sure to read the [getting started guide](http://docs.grafana.org/guides/gettingstarted/) and the other feature guides.

## Run from master
If you want to build a package yourself, or contribute. Here is a guide for how to do that. You can always find
the latest master builds [here](https://grafana.com/grafana/download)

### Dependencies

- Go 1.8.1
- NodeJS LTS

Since imports of dependencies use the absolute path github.com/grafana/grafana within the $GOPATH,
you will need to put your version of the code in $GOPATH/src/github.com/grafana/grafana to be able
to develop and build grafana on a cloned repository. To do so, you can clone your forked repository
directly to $GOPATH/src/github.com/grafana or you can create a symbolic link from your version
of the code to $GOPATH/src/github.com/grafana/grafana. The last options makes it possible to change
easily the grafana repository you want to build.
```bash
go get github.com/*your_account*/grafana
mkdir $GOPATH/src/github.com/grafana
ln -s  github.com/*your_account*/grafana $GOPATH/src/github.com/grafana/grafana
```

### Building the backend
```bash
go get github.com/grafana/grafana
cd ~/go/src/github.com/grafana/grafana
go run build.go setup
go run build.go build
```

### Building frontend assets

To build less to css for the frontend you will need a recent version of **node (v6+)**,
npm (v2.5.0) and grunt (v0.4.5). Run the following:

```bash
npm install -g yarn
yarn install --pure-lockfile
npm run build
```

To build the frontend assets only on changes:

```bash
npm run dev
```

### Recompile backend on source change
To rebuild on source change.
```bash
go get github.com/Unknwon/bra
bra run
```

Open grafana in your browser (default: `http://localhost:3000`) and login with admin user (default: `user/pass = admin/admin`).

### Dev config

Create a custom.ini in the conf directory to override default configuration options.
You only need to add the options you want to override. Config files are applied in the order of:

1. grafana.ini
1. custom.ini

## Contribute
If you have any idea for an improvement or found a bug do not hesitate to open an issue.
And if you have time clone this repo and submit a pull request and help me make Grafana
the kickass metrics & devops dashboard we all dream about!

## License
Grafana is distributed under Apache 2.0 License.
Work in progress Grafana 2.0 (with included Grafana backend)
