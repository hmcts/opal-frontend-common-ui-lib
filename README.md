# OPAL Frontend Common UI Library

[![npm version](https://img.shields.io/npm/v/@hmcts/opal-frontend-common)](https://www.npmjs.com/package/@hmcts/opal-frontend-common)
[![License](https://img.shields.io/npm/l/@hmcts/opal-frontend-common)](https://github.com/hmcts/opal-frontend-common-ui-lib/blob/main/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hmcts_opal-frontend-common-ui-lib&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hmcts_opal-frontend-common-ui-lib)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=hmcts_opal-frontend-common-ui-lib&metric=coverage)](https://sonarcloud.io/summary/new_code?id=hmcts_opal-frontend-common-ui-lib)

This is an [Angular Library](https://angular.dev/tools/libraries).

## Table of Contents

- [Getting Started](#getting-started)
- [Development server](#development-server)
- [Build](#build)
- [Switching Between Local and Published Versions](#switching-between-local-and-published-versions)
- [Running unit tests](#running-unit-tests)
- [Angular code scaffolding](#angular-code-scaffolding)
- [Commonly Used Commands](#commonly-used-commands)
- [Using This Library](#using-this-library-in-an-angular-application-eg-opal-frontend)
- [Publishing the Library](#publishing-the-library)

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

## Build

Run `yarn ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Switching Between Local and Published Versions

See [opal-frontend](https://github.com/hmcts/opal-frontend) for how this library is consumed in practice.

Use the `yarn import:local:common-ui-lib` and `yarn import:published:common-ui-lib` scripts in your consuming project (`opal-frontend`) to switch between local development and the published npm version of the library.

To use a published version of this library during development in another project:

1. In the consuming project, run:
   ```bash
   yarn import:published:common-ui-lib
   ```

To use a local version of this library during development in another project:

1. Build this library:

   ```bash
   yarn build
   ```

2. In your consuming project (e.g. `opal-frontend`), ensure you have set an environment variable pointing to the local build:

   ```bash
   # In your shell config file (.zshrc, .bash_profile, or .bashrc)
   export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB FOLDER]"
   ```

3. In the consuming project (e.g. `opal-frontend`), run:

   ```bash
   yarn import:local:common-ui-lib
   ```

   This will remove the published version and install the local build using the path provided.

4. To switch back to the published version:
   ```bash
   yarn import:published:common-ui-lib
   ```

This setup makes it easy to switch between development and production versions of the shared library.

## Publishing the Library

Once any changes have been approved and merged into the main branch, you'll need to publish a new version of the library so that it can be consumed by other projects. To do this:

1. Increment the version number in both the library's root `package.json` and in `/projects/opal-frontend-common/package.json`.
2. Commit and push those changes to the main branch.
3. On GitHub, create a new [release](https://github.com/hmcts/opal-frontend-common-ui-lib/releases) and use the updated version number as a tag.
4. When the release workflow completes, the library will be published.

After this new version of the library is published, any consuming application should remove the local or outdated version of the library and then install the published version by running:

    ```bash
    yarn import:published:common-ui-lib
    ```

## Running unit tests

Run `yarn test` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html).

To check code coverage, run `yarn test:coverage` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html) but with code coverage.
The coverage report will be available in the coverage/ directory (e.g. coverage/index.html).

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

#### Example Usage of Entry Points

To import a module from a specific entry point in your application:

```ts
// Example: Importing various items from the library
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { userStateResolver } from '@hmcts/opal-frontend-common/resolvers/user-state';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
```

## Commonly Used Commands

The following commands are available in the `package.json`:

- `yarn build`  
  Builds the Angular library and outputs to the `dist/` folder.

- `yarn test`  
  Executes unit tests via [karma](https://karma-runner.github.io/latest/index.html).

- `yarn test:coverage`  
  Runs unit tests with code coverage reporting enabled. The coverage report can be found in the `coverage/` directory.

- `yarn lint`  
  Runs linting using ESLint.

- `yarn prettier`  
  Checks that all files conform to the Prettier formatting rules.

- `yarn prettier:fix`  
  Automatically formats files using Prettier.
