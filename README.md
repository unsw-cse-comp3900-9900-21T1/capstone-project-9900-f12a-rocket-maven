# Rocket Maven
🚀🚀🚀 Investment Portfolio Management 🚀🚀🚀

## Getting Started

Read [ARCHITECTURE.md](ARCHITECTURE.md) and [CONTRIBUTING.md](CONTRIBUTING.md)

## Front End Prerequisites

### Global Environment

`Node.js`  v14.16.0 (lts)

`npm` v6.14.11 - I think this is the default version on ubuntu. I don't think versioning of this makes too much of a difference since it is just a package manager

### Development Tools

VSCode
- ESLint extension

### Setup

```
cd client
npm install
npm run start
```

## Back End Prerequisites

### Global Environment

`Python 3.7`

Global [tox](https://tox.readthedocs.io/en/latest/index.html) install: `pip3 install tox`

Alternative command: `python -m pip install tox` (for Python installed from the Windows store)

Global [tox-conda](https://github.com/tox-dev/tox-conda) install: `pip3 install tox-conda`

Alternative command: `python -m pip install tox-conda` (for Python installed from the Windows store)

Install [Miniconda](https://conda.io/en/master/index.html): https://conda.io/en/master/miniconda.html

### Setup

`cd backend`

`rm -r .tox` - clean up: removes tox from the backend folder if present

`tox -e dev -r` - sets up a Tox python development environment at ../.tox/ (an out-of-tree .tox folder at the same level of this repo's folder, isolated from your main Python installation). Note! This is important when the requirements.txt file is changed.

### Development

`tox -e dev` - uses the Tox python development environment to launch the server

Alternative commands:

- `python -m tox -e dev`

- `start cmd /k tox -e dev` (get around control+c not working on Windows)

Visit: [http://127.0.0.1:5100/swagger-ui](http://127.0.0.1:5100/swagger-ui)

### Testing

`tox -e test`
