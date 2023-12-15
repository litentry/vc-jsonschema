import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('11-token-holder/1-0-0.json'),

  title: 'Token Holder',
  description: 'The number of a particular token you hold > 0',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Achainable assertion/ Token Holder',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$is_eth_holder', '$is_lit_holder', '$is_dot_holder'],
            op: '==',
            dst: 'true',
          }),
        ],
      }),
    }),
  },
};
