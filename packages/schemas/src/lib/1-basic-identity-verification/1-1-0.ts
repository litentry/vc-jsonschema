import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('1-basic-identity-verification/1-1-0.json'),

  title: 'Basic Identity Verification',
  description:
    "You've identified at least one account/address in both Web2 and Web3.",

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of A1 assertion/ Basic Identity Verification',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$has_web2_account'],
            op: ['=='],
            dst: ['true'],
          }),
          assertion.clause({
            src: ['$has_web3_account'],
            op: ['=='],
            dst: ['true'],
          }),
        ],
      }),
    }),
  },
};
