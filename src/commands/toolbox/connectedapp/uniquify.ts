/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Flags, CliUx } from '@oclif/core';
import { Messages } from '@salesforce/core';
import { SfCommand } from '@salesforce/sf-plugins-core';
import * as chalk from 'chalk';
import fs = require('fs-extra');
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { getExisting } from '../../../shared/getExisting';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@dx-cli-toolbox/sfdx-toolbox-utils', 'toolbox-connectedapp-uniquify');

export interface ConnectedAppUniquifyResponse {
  consumerKey: string;
}

export default class ConnectedAppUniquify extends SfCommand<ConnectedAppUniquifyResponse> {

  public static description = messages.getMessage('commandDescription');

  public static examples = [messages.getMessage('exampleDescription')];

  public static requiresProject = true;

  public static flags = {
    app: Flags.file({ char: 'a', required: true, description: 'full path to your connected app locally' }),
  };

  public async run(): Promise<ConnectedAppUniquifyResponse> {
    const { flags } = await this.parse(ConnectedAppUniquify);
    if (!(await fs.pathExists(flags.app))) {
      throw new Error(`file not found: ${flags.app}`);
    }

    const consumerKeyLength = 85;
    const consumerKey = [...Array(consumerKeyLength)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existing = await getExisting(flags.app, 'ConnectedApp');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    existing.oauthConfig.consumerKey = consumerKey;

    await writeJSONasXML({
      type: 'ConnectedApp',
      path: flags.app,
      json: existing,
    });

    this.log(`${chalk.green('Connected app updated locally')}.\n\nConsumer Key is now ${consumerKey}`);

    return { consumerKey } as ConnectedAppUniquifyResponse;
  }
}
