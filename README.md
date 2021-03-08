# Rocket Maven
🚀🚀🚀 Investment Portfolio Management 🚀🚀🚀

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

`Python 3.6+`

Global tox install (tox and its dependencies are the only global python packages required for the Rocket Maven system): `pip3 install tox`

### Setup

`cd backend`

`rm -r .tox` - clean up: removes tox from the backend folder if present

`tox -e dev` - sets up a Tox python development environment at ../.tox/ (an out-of-tree .tox folder at the same level of this repo's folder, isolated from your main Python installation) and launches the server

Visit: [http://127.0.0.1:5100/swagger-ui](http://127.0.0.1:5100/swagger-ui)



