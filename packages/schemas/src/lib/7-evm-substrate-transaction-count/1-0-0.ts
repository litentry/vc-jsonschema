import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('7-evm-substrate-transaction-count/1-0-0.json'),

  title: 'EVM/Substrate Transaction Count',
  description:
    'Gets the range of number of transactions a user has made for a specific token on all supported networks (invalid transactions are also counted)',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of A8 assertion/ EVM/Substrate Transaction Count',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$total_txs',
            op: '>=',
            dst: undefined, // value is set by the issuer
          }),
          assertion.clause({
            src: '$total_txs',
            op: '<',
            dst: undefined, // value is set by the issuer
          }),
          assertion.or({
            items: assertion.clause({
              src: '$network',
              op: '==',
              dst: undefined, // value is set by the issuer
            }),
          }),
        ],
      }),
    }),
  },
};
