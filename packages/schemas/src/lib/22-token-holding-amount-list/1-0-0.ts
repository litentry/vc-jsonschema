import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

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

  $id: resolveGitHubPath('22-token-holding-amount-list/1-0-0.json'),

  title: 'Token holding amount list',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount list',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: supportedTokens,
            op: ['=='],
            dst: undefined, // Range based on user holding amount. Format is a string.
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['>='],
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
