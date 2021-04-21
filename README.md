# Rocket Maven
🚀🚀🚀 Investment Portfolio Management 🚀🚀🚀

## Getting Started

Read [ARCHITECTURE.md](ARCHITECTURE.md) and [CONTRIBUTING.md](CONTRIBUTING.md)

## Front End Prerequisites

### Global Environment

`Node.js`  v14.16.0 (lts)

`npm` v6.14.11

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

`Python 3.7` https://www.python.org/downloads/release/python-373/

Global [tox](https://tox.readthedocs.io/en/latest/index.html) install: `pip3 install tox`

Alternative command: `python -m pip install tox` (for Python installed from the Windows store)

Global [tox-conda](https://github.com/tox-dev/tox-conda) install: `pip3 install tox-conda`

Alternative command: `python -m pip install tox-conda` (for Python installed from the Windows store)

Install [Miniconda](https://conda.io/en/master/index.html): https://conda.io/en/master/miniconda.html

### Setup

`cd backend`

`tox -e dev -r` - sets up a Tox python development environment at ../.tox/ (an out-of-tree .tox folder at the same level of this repo's folder, isolated from your main Python installation). Note! This is important when the requirements.txt file is changed.

### Development

`tox -e dev` - uses the Tox python development environment to launch the server

`tox -e dev-noconda` - uses the Tox python development environment (without conda as a requirement) to launch the server

Alternative commands:

- `python -m tox -e dev`

Visit: [http://127.0.0.1:5100/swagger-ui](http://127.0.0.1:5100/swagger-ui)

### Testing

`tox -e test`
