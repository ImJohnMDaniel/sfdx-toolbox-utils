import { Flags, CliUx } from '@oclif/core';
import { SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, SfError, SfProject } from '@salesforce/core';
import fs = require('fs-extra');
import * as _ from 'lodash';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@dx-cli-toolbox/sfdx-toolbox-utils', 'toolbox-apex-codecoverage-check');

export interface CheckResponse {

}

export default class Check extends SfCommand<CheckResponse> {

    public static description = messages.getMessage('commandDescription');

    public static examples = [messages.getMessage('example1Description'), messages.getMessage('example2Description')];

    public static flags = {
        testcoveragefile: Flags.string({ char: 'f', required: true, description: messages.getMessage('testCoverageFileFlagDescription') }),
        ignoreorgcoverage: Flags.boolean({ char: 'o', required: false, default: false, description: messages.getMessage('ignoreOrgCoverageFailureFlagDescription')}),
        ignoreclasscoverage: Flags.boolean({ char: 'c', required: false, default: false, description: messages.getMessage('ignoreClassCoverageFailuresFlagDescription')}),
        throwerroroninsufficientorgcoverage: Flags.boolean({ char: 'x', required: false, default: false, description: messages.getMessage('throwErrorOnInsufficientOrgCoverageFlagDescription')}),
        throwerroroninsufficientclasscoverage: Flags.boolean({ char: 'y', required: false, default: false, description: messages.getMessage('throwErrorOnInsufficientClassCoverageFlagDescription')})
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    public static requiresProject = true;

    public async run(): Promise<CheckResponse> { // tslint:disable-line:no-any
        const { flags } = await this.parse(Check);
        const checkResult = {};
        
        // const projectJson = await this.project.retrieveSfdxProjectJson();
        const projectJson: SfProject = await SfProject.resolve();
        // this.logJson(projectJson);
        // this.logJson(projectJson['contents']); // this approach works!!!
        // const blue = projectJson.get('contents');
        // this.logJson(blue);

        // const converageRequirementForApexClass = _.get(projectJson.get('plugins'), 'toolbox.coverageRequirement') || 70;
        // const converageRequirementForApexClass = _.get(projectJson.get('contents'), 'plugins.toolbox.coverageRequirementForClasses', 81);

        // this.logJson(converageRequirementForApexClass);
        // When reading a file with core library, it is an async operation and thus you need the "await" command added.
        this.log(messages.getMessage('commandStartMessage', [flags.testcoveragefile]));
        checkResult['testCoverageFileReviewed'] = flags.testcoveragefile;
        // JSON.parse(fs.readFileSync(projectFile.getPath(), 'UTF-8'));
        // const coverages = await core.fs.readJsonMap(flags.testcoveragefile);
        const testResultInformation = JSON.parse(fs.readFileSync(flags.testcoveragefile, 'UTF-8'));

        let allClassesHaveSufficientCodeCoverage = true;
        let orgHasSufficientCodeCoverage = true;
        const actionMessages = [];

        const ignoreClassCoverageProjectJsonSetting = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.ignoreClassCoverage', false) as boolean;
        const ignoreOrgCoverageProjectJsonSetting = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.ignoreOrgCoverage', false) as boolean;

        // flag true should override attribute.  the flag=true means that we should ignore, so don't go into the If/block
        // flag = null    attribute = true    reasult = false
        // flag = true    attribute = true    reasult = false
        // flag = null    attribute = false    reasult = true
        // flag = true    attribute = false    reasult = false

        if ( ! flags.ignoreorgcoverage && ! ignoreOrgCoverageProjectJsonSetting) {
            const converageRequirementForOrg = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.org', "50");
            const summaryResultInformation = testResultInformation.summary;
            const orgWideCoverage = summaryResultInformation.orgWideCoverage.replace('%', '');

            const orgSuccessResult = {};

            orgSuccessResult['coveredPercent'] = orgWideCoverage;
            orgSuccessResult['converageRequirementForOrg'] = converageRequirementForOrg;

            // this.log('orgWideCoverage == ' + orgWideCoverage);
            if ( orgWideCoverage < converageRequirementForOrg ) {
                // TODO: Need to refactor this to list all errors once the process is complete
                // throw new core.SfdxError(messages.getMessage('errorOrgWideCoverageBelowMinimum', [orgWideCoverage, converageRequirementForOrg]));
                actionMessages.push(messages.getMessage('errorOrgWideCoverageBelowMinimum', [orgWideCoverage, converageRequirementForOrg]));
                    this.error(messages.getMessage('errorOrgWideCoverageBelowMinimum', [orgWideCoverage, converageRequirementForOrg]), { exit: false });
                orgSuccessResult['success'] = false;
                orgHasSufficientCodeCoverage = false;
            } else {
                orgSuccessResult['success'] = true;
            }
            if (!checkResult['coverage']) {
                checkResult['coverage'] = {};
            }
            checkResult['coverage'].org = orgSuccessResult;
        }

        if ( ! flags.ignoreclasscoverage && ! ignoreClassCoverageProjectJsonSetting) {
            const converageRequirementForApexClass = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.classes', "73");

            const coverageResultInformation = testResultInformation.coverage;
            // this.logJson(coverageResultInformation);

            const coverageSubsectionResultInformation = coverageResultInformation.coverage;
            // this.logJson(coverageSubsectionResultInformation);

            // orgSuccessResult['success'] = false;
            const classDetailCoverages = [];

            // classesResult['classes'] = orgSuccessResult;
            // checkResult['coverage'] = classesResult;

            // The following output only works if the testcoveragefile is test-result-7070000000.json file
            // this reviews the individual coverage for each Apex class file
            _.forEach(coverageSubsectionResultInformation, coverage => {
                const classSuccessResult = {};
                // this.log('coverage[coveredPercent] == ' + coverage['coveredPercent']);
                classSuccessResult['name'] = coverage['name'];

                if (_.isInteger(coverage['coveredPercent'])) {
                    classSuccessResult['coveredPercent'] = _.toString(coverage['coveredPercent']);
                } else {
                    classSuccessResult['coveredPercent'] = coverage['coveredPercent'];
                }

                if (coverage['coveredPercent'] < converageRequirementForApexClass) {
                    // TODO: Need to refactor this to list all errors once the process is complete
                    // throw new core.SfdxError(`The coverage for ${coverage['name']} is less than ${converageRequirementForApexClass}`);
                    // this.error(`The coverage for ${coverage['name']} is less than ${converageRequirementForApexClass}`);
                    actionMessages.push(messages.getMessage('errorClassCoverageBelowMinimum', [coverage['name'], coverage['coveredPercent'], converageRequirementForApexClass]));
                        this.error(messages.getMessage('errorClassCoverageBelowMinimum', [coverage['name'], coverage['coveredPercent'], converageRequirementForApexClass]));
                    classSuccessResult['success'] = false;
                    allClassesHaveSufficientCodeCoverage = false;
                } else {
                    classSuccessResult['success'] = true;
                }
                classDetailCoverages.push(classSuccessResult);
            });
            const classesResult = {};
            classesResult['converageRequirementForClasses'] = converageRequirementForApexClass;
            classesResult['success'] = allClassesHaveSufficientCodeCoverage;
            classesResult['classDetailCoverage'] = classDetailCoverages;
            if (!checkResult['coverage']) {
                checkResult['coverage'] = {};
            }
            checkResult['coverage'].classes = classesResult;
        }

        const throwErrorOnInsufficientOrgCoverageProjectJsonSetting = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.throwErrorOnInsufficientOrgCoverage', false) as boolean;
        const throwErrorOnInsufficientClassCoverageProjectJsonSetting = _.get(projectJson['contents'], 'plugins.toolbox.coverageRequirement.throwErrorOnInsufficientClassCoverage', false) as boolean;

        // throw error if called for
        if ( (!flags.ignoreorgcoverage && ( flags.throwerroroninsufficientorgcoverage || throwErrorOnInsufficientOrgCoverageProjectJsonSetting) && !orgHasSufficientCodeCoverage)
            || (!flags.ignoreclasscoverage && (flags.throwerroroninsufficientclasscoverage || throwErrorOnInsufficientClassCoverageProjectJsonSetting) && !allClassesHaveSufficientCodeCoverage)
        ) {
            throw new SfError('Code Coverage Insufficient', 'CODE_COVERAGE_INSUFFICIENT', actionMessages, 1, null);
        }

        // Return an object to be displayed with --json
        return checkResult;
    }
}
