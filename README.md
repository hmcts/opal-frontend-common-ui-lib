# OPAL Frontend Common UI Library 

This is an [Angular Library](https://angular.dev/tools/libraries). 

## Getting Started

### Prerequisites
Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v23.7.0 or later

- [yarn](https://yarnpkg.com/) v4

### Install Dependencies
Install dependencies by executing the following command:

```bash

yarn

```

## Development server

Run `yarn ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `yarn ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `yarn test` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html).

To check code coverage, run `yarn test:coverage` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html) but with code coverage.
Code coverage can then be found in the coverage folder of the repository locally.

## Angular code scaffolding

Run `yarn ng generate component component-name` to generate a new component. You can also use `yarn ng generate directive|pipe|service|class|guard|interface|enum|module`.

Note the requirement for prefixing the `ng` commands with `yarn`
