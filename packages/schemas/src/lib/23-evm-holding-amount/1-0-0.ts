import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/nodereal/amount_holding/evm_amount_holding.rs
const supportedTokens = ['TRX', 'TON'];

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('19-token-holding-amount/1-0-0.json'),

  title: 'Token holding amount',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$token'],
            op: ['=='],
            dst: supportedTokens,
          }),
          assertion.or({
            items: assertion.and({
              // describes the list, no strict items count check
              items: [
                assertion.clause({
                  src: ['$network'],
                  op: ['=='],
                  dst: ['ethereum', 'bsc'],
                }),
                assertion.clause({
                  src: ['$address'],
                  op: ['=='],
                  dst: [
                    // trx
                    '0x50327c6c5a14dcade707abad2e27eb517df87ab5',
                    '0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3',
                    // ton
                    '0x76a797a59ba2c17726896976b7b3747bfd1d220f',
                    '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
                  ],
                }),
              ],
            }),
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['<'],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
      }),
    }),
  },
};
