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

### Component Prefixing

This library uses the prefix `opal-lib` for all of its shared components, as specified in the `angular.json` file. When generating new components, make sure they are prefixed accordingly. This ensures consistent naming and avoids naming collisions across applications.

Run `yarn ng generate component component-name` to generate a new component. You can also use `yarn ng generate directive|pipe|service|class|guard|interface|enum|module`.

Note the requirement for prefixing the `ng` commands with `yarn`

### Multiple Entry Points

This library uses multiple entry points, which allows you to organize and expose different parts of the library in separate modules. Each entry point requires:

- An `ng-package.json` to define how the entry point should be packaged.
- A `package.json` to specify the entry point's metadata and dependencies.
- A `public-api.ts` to declare and export the resources for that entry point.

Alias paths need to be set in both the `/projects/opal-frontend-common/package.json` and the library's `tsconfig.json`. These aliases help the consuming application import from each entry point using the correct path. By properly defining these aliases, developers can import modules from your library entry points without resorting to complex relative paths.

## Commonly Used Commands

### Lint

Run `yarn lint` to check your codebase for linting errors.

### Prettier Fix

Run `yarn prettier:fix` to automatically format your code according to the Prettier rules.

### Test Coverage

Run `yarn test:coverage` to execute unit tests with code coverage. The coverage report will then be available in the coverage folder.

## Using This Library in an Angular Application (e.g. opal-frontend)

Here are some common commands you might use when integrating this library into another Angular project:

- `yarn remove @hmcts/opal-frontend-common`
  Removes the existing library package.

- `rm -rf .angular/cache`
  Clears the Angular build cache, which can help avoid issues caused by stale builds.

- `yarn add @hmcts/opal-frontend-common@file:[insert location from library terminal after building]`
  Installs the library from a local file path (the build output). Replace `[insert location from library terminal after building]` with the actual path to the generated package.

## Publishing the Library

Once any changes have been approved and merged into the main branch, you'll need to publish a new version of the library so that it can be consumed by other projects. To do this:

1. Increment the version number in both the library's root `package.json` and in `/projects/opal-frontend-common/package.json`.
2. Commit and push those changes to the main branch.
3. On GitHub, create a new release and use the updated version number as a tag.
4. When the release workflow completes, the library will be published.

After this new version of the library is published, any consuming application should remove the local or outdated version of the library and then install the published version by running:

```bash
yarn remove @hmcts/opal-frontend-common
rm -rf .angular/cache
yarn add @hmcts/opal-frontend-common
```
