import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/brc20/amount_holder.rs
const supportedTokens = [
  '$ordi',
  '$sats',
  '$rats',
  '$MMSS',
  '$long',
  '$cats',
  '$BTCs',
];

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('20-token-holding-amount-list/1-1-1.json'),

  title: 'Token holding amount list',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount list',
      assertionsProps: {
        minItems: 0,
        maxItems: supportedTokens.length,
      },
      assertions: assertion.and({
        minItems: 2,
        maxItems: 3,
        items: [
          assertion.clause({
            src: ['$token'],
            op: ['=='],
            dst: supportedTokens,
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['>', '>='],
            dst: undefined, // Range based on user holding amount. Format is a string.
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['<'],
            dst: undefined, // Range based on user holding amount. Format is a string.
          }),
        ],
      }),
    }),
  },
};
