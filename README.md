toolbox-sfdx-utils
===============

Collection of commands to work with SalesforceDX codebases

[![Version](https://img.shields.io/npm/v/toolbox-sfdx-utils.svg)](https://npmjs.org/package/toolbox-sfdx-utils)
[![CircleCI](https://circleci.com/gh/RootstockMFG/toolbox-sfdx-utils/tree/master.svg?style=shield)](https://circleci.com/gh/RootstockMFG/toolbox-sfdx-utils/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/RootstockMFG/toolbox-sfdx-utils?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/toolbox-sfdx-utils/branch/master)
[![Codecov](https://codecov.io/gh/RootstockMFG/toolbox-sfdx-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/RootstockMFG/toolbox-sfdx-utils)
[![Greenkeeper](https://badges.greenkeeper.io/RootstockMFG/toolbox-sfdx-utils.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/RootstockMFG/toolbox-sfdx-utils/badge.svg)](https://snyk.io/test/github/RootstockMFG/toolbox-sfdx-utils)
[![Downloads/week](https://img.shields.io/npm/dw/toolbox-sfdx-utils.svg)](https://npmjs.org/package/toolbox-sfdx-utils)
[![License](https://img.shields.io/npm/l/toolbox-sfdx-utils.svg)](https://github.com/RootstockMFG/toolbox-sfdx-utils/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @dx-cli-toolbox/sfdx-toolbox-utils
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
@dx-cli-toolbox/sfdx-toolbox-utils/0.1.1 darwin-x64 node-v17.0.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx toolbox:apex:codecoverage:check`](#sfdx-toolboxapexcodecoveragecheck)
* [`sfdx toolbox:connectedapp:uniquify`](#sfdx-toolboxconnectedappuniquify)

## `sfdx toolbox:apex:codecoverage:check`

Review the unit test codecoverage report for an org and return an error if the coverage is not sufficient

```
USAGE
  $ sfdx toolbox:apex:codecoverage:check

OPTIONS
  -c, --ignoreclasscoverage                    Include this flag to not fail the command if the individal Apex classes
                                               code coverage is below the amount specified

  -f, --testcoveragefile=testcoveragefile      (required) Location of test coverage file.  Usually, this is the
                                               'test-result-707000000000000.json' where the 707 number is the unit test
                                               run id.  Be sure to choose the json file.

  -o, --ignoreorgcoverage                      Include this flag to not fail the command if the org coverage is below
                                               the amount specified

  -x, --throwerroroninsufficientorgcoverage    If true, the command will throw an error exception if the org code
                                               coverage requirement is not met.

  -y, --throwerroroninsufficientclasscoverage  If true, the command will throw an error exception if the class code
                                               coverage requirement is not met.

  --json                                       Format output as json.

DESCRIPTION
  Set org and individual class coverage thresholds in the sfdx-project.json file.  Add some or all of the following 
  attributes to the "plugins.toolbox.coverageRequirement" section of the project json file.

  "plugins": {
      "toolbox": {
          "coverageRequirement": {
              "classes": "75",
              "org": "45",
              "ignoreClassCoverage": false,
              "ignoreOrgCoverage": true,
              "throwErrorOnInsufficientOrgCoverage": false,
              "throwErrorOnInsufficientClassCoverage": false
          }
      }
  }

EXAMPLES
  $ sfdx toolbox:apex:codecoverage:check --targetusername myOrg@example.com --targetdevhubusername devhub@org.com 
  --testcoveragefile test-result-707000000000000.json
  Reviewing code coverage from file test-result-707000000000000.json

  $ sfdx toolbox:apex:codecoverage:check --testcoveragefile test-result-707000000000000.json --ignoreorgcoverage 
  --throwerroroninsufficientclasscoverage --json
  Reviewing code coverage from file test-result-707000000000000.json
```

_See code: [src/commands/toolbox/apex/codecoverage/check.ts](https://github.com/ImJohnMDaniel/sfdx-toolbox-utils/blob/v0.1.1/src/commands/toolbox/apex/codecoverage/check.ts)_

## `sfdx toolbox:connectedapp:uniquify`

Modifis a clientId/consumerKey on a local connected app file to guaranatee uniqueness.

```
USAGE
  $ sfdx toolbox:connectedapp:uniquify

OPTIONS
  -a, --app=app  (required) full path to your connected app locally
  --json         Format output as json.

EXAMPLE
  $ sfdx toolbox:connectedapp:uniquify -a sfdx-source/main/connectedApps/myConnectedApp.connectedApp-meta.xml
  Update the consumerKey of myConnectedApp to be unique
```

_See code: [src/commands/toolbox/connectedapp/uniquify.ts](https://github.com/ImJohnMDaniel/sfdx-toolbox-utils/blob/v0.1.1/src/commands/toolbox/connectedapp/uniquify.ts)_
<!-- commandsstop -->
