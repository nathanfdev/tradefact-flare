# tradefact.companydashboard

Frontend web application for the company facing portion of tradefact.

## First run

Make sure to run `yarn install` when you first pull the project, and after subsequent pulls/merges, incase dependencies have changed. Also be sure to create the associated `.env` files for the environment you're targetting, otherwise certain information will be missing.

## Yarn scripts

`yarn pretty` - Runs Prettier against all source files
`yarn lint` - Runs ESLint against all source files
`yarn test` - Runs all Jest tests
`yarn build` - Builds the app for production, outputs to `/dist`
`yarn serve` - Build the app for development, and starts a local server

## Project structure overview

```
.
|-- .vscode/                              - project specific configurations for VSCode
|-- config/                               - project specific configuration files, used for .env files
|-- coverage/                             - test coverage reports
|-- dist/                                 - location of bundled application
|-- node_modules/                         - the internet
|-- public/                               - static files served via webpack-dev-server
|-- scripts/                              - scripts relating to build steps / utility scripts
|-- src/                                  - root directory for application sources
  |-- components/                         - root directory for application components
    |-- component-name/                   - container directory for a specific component
      |-- components/                     - root directory for sub-components of `component-name`
        |-- sub-component-name/           - container directory for a specific sub-component
          |-- sub-component-name.tsx      - source file for sub-component
          |-- index.ts                    - barrel for sub-component, exports any public functionality
        |-- index.ts                      - barrel for all sub-components, exports any public functionality
      |-- component-name.tsx              - source file for component
      |-- index.ts                        - barrel for component, exports any public functionality
    |-- index.ts                          - barrel for all components, exports any public functionality
  |-- packages/                           - root directory for packages
    |-- package-name/                     - container directory for a specific package
  |-- routes/                             - root directory for application routes
    |-- route-name/                       - container directory for a specific route
      |-- route-name.tsx                  - source file for route
      |-- index.ts                        - barrel for route, exports any public functionality
    |-- index.ts                          - barrel for all routes, exports any public functionality
  |-- styles/                             - root directory for application styles
  |-- index.html                          - root HTML template
  |-- index.tsx                           - application entry point
  |-- styles.scss                         - root SCSS styles
|-- .editorconfig                         - configuration file for editorconfig
|-- .eslintignore                         - ignore configuration for eslint
|-- .eslintrc                             - configuration file for eslint
|-- .gitignore                            - ignore configuration for git
|-- .prettierrc                           - configuration file for prettier
|-- jest.config.json                      - configuration file for jest
|-- overrides.d.ts                        - TypeScript declaration file for adding/modifying globals
|-- package.json                          - configuration file for NPM
|-- README.md                             - ...
|-- tsconfig.json                         - configuration file for TypeScript
|-- webpack.config.ts                     - configuration file for Webpack
|-- yarn.lock                             - lockfile for Yarn
```

## Config

When you pull the repository, the `config/` directory will likely be empty. This is because the `.env` files can (potentially) hold sensitive information. Secrets for communicating with the backend, Google Maps, Intercom, etc are all planned to be stored here and referenced via `process.env.ENVIRONMENT_VARIABLE`.

Because of this, some of the app may fail if you don't populate the files with the required information. This is a decent tradeoff, as we really don't want this information stored in source control. The plan is to have these files injected into the directory just before building for development and production. Running locally just requires you to have this information on hand.

## Scripts

Currently there's only one script used, and it's a setup script for Jest tests. Over time this folder will likely grow to contain other setup/build scripts.

## Components

The file structure for components is such that, you will be able to keep all files relating to that component within a folder, including any components that are _only ever_ used by the containing component (`sub-component`). If possible, try not to have `sub-sub-components`, because this will end up making the folder tree get pretty deep. A rule of thumb is that, if a sub-component needs it's own sub-component, just extract the root sub-component out to a normal component, and _then_ add sub-components.

## Packages

The `packages/` directory is meant as a temporary location to keep code that will eventually become a standalone NPM package. There is no predefined structure for how the files should be laid out in this folder, just that each package has a containing folder called the name of the package. This should make moving these packages to NPM much easier, since the only changes required would be changing an import:

```
import { foo } from '../packages/package-name'
```

becomes:

```
import { foo } from 'package-name'
```

## Routes

The file structure for routes are pretty similar to components, except that routes _cannot_ have sub-components. This is purely for organizational purposes. The name of the containing folder for a route should ideally match the URL that will be used in the app. Of course this isn't always possible `/foo/{id}/bar`, but if we can keep this pattern it should help a lot in organization.

## Styles

Any style related files should live here. Currently it's just a Bootstrap4 import, with some custom styles that we need.
