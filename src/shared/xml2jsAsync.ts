/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as xml2js from 'xml2js';

const getParsed = async (xmlToParse, explicitArray = false): Promise<any> => {
  const parser = new xml2js.Parser({ explicitArray });

  return new Promise((resolve, reject) => {
    parser.parseString(xmlToParse, (err, json: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
};

export { getParsed };
