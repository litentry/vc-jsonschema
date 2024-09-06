import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// Reference:
// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials-v2/src/linked_identities/mod.rs

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('27-linked-identities/1-0-0.json'),

  title: 'Linked web2/web3 identities',
  description: 'All web2 and web3 identities you linked',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Linked web2/web3 identities',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$identities'],
            op: ['=='],
            dst: undefined, // identity array string.
          }),
        ],
      }),
    }),
  },
};
