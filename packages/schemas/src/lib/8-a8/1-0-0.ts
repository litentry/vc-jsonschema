import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('a8/1-0-0.json'),

  title: 'EVM/Substrate Transaction Count',
  description:
    'Gets the range of number of transactions a user has made for a specific token on all supported networks (invalid transactions are also counted)',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$total_txs',
            op: '>=',
            dst: '20',
          }),
          assertion.clause({
            src: '$total_txs',
            op: '<',
            dst: '50',
          }),
          assertion.or({
            items: [
              assertion.clause({
                src: '$network',
                op: '==',
                dst: 'Polkadot',
              }),
            ],
          }),
        ],
      }),
    }),
  },
};
