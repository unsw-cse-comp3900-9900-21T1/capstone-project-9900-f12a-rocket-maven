# Architecture

## Bird's Eye View

![](https://raw.github.com/unsw-cse-comp3900-9900-21T1/capstone-project-9900-f12a-rocket-maven/main/documents/contarchitecture.svg?sanitize=true)

## Code Map

### User Interface / View

Located in the `/client` folder

Uses React.js and TypeScript

### REST API Controllers

Located at `backend/RocketMaven/api/controllers.py`

Uses Flask + apispec + marshmallow

The resource methods should only contain an apispec yaml doc and a call to its correlated service function

### Services

Located at the `backend/RocketMaven/services/` folder, intended to contain the business logic of the controller resources, interacting with the APIs and the database models

### Authentication

Located at `backend/RocketMaven/auth/controllers.py`. Not much to worry about as flask-jwt-extended handles most of the work

### API

Calls to external APIs are meant to be implemented in their respective service definitions

### Database Models

Located in the `backend/RocketMaven/models/` folder
