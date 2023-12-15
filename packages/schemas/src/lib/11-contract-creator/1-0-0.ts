import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('11-contract-creator/1-0-0.json'),

  title: 'Contract Creator',
  description: 'You are a deployer of a smart contract',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Achainable assertion/ Contract Creator',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$is_contract_creator',
            op: '==',
            dst: 'true',
          }),
        ],
      }),
    }),
  },
};
