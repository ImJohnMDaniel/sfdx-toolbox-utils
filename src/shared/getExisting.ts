/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as fs from 'fs-extra';
import { getParsed } from './xml2jsAsync';

export async function getExisting(targetFilename: string, subType: string, defaults?: object) {
  // get or create permset
  if (fs.existsSync(targetFilename)) {
    const existing = await getParsed(await fs.readFile(targetFilename));
    return existing[subType];
  }
  if (defaults) {
    return defaults;
  }
  throw new Error(`Not found: ${targetFilename}`);
}
