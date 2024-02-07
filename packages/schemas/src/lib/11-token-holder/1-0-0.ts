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
            src: [
              // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/assertion-build/src/achainable/amount.rs
              '$is_contract_creator',
              '$is_eth_holder',
              '$is_lit_holder',
              '$is_dot_holder',
              // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/assertion-build/src/achainable/basic.rs
              'is_bab_holder',
              '$is_bab_holder',
            ],
            op: ['=='],
            dst: ['true'],
          }),
        ],
      }),
    }),
  },
};
