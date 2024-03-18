import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('4-token-holding-time/1-1-0.json'),

  title: 'Token Holding Time',
  description:
    'The length of time a user continues to hold a particular token (with particular threshold of token amount)',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of A4, A7, A10, and A11 assertions/ Token Holding Time',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$minimum_amount'],
            op: ['=='],
            dst: undefined, // value is set by the issuer
          }),
          assertion.clause({
            src: ['$from_date'],
            op: ['<'],
            dst: undefined, // value is set by the issuer
          }),
          assertion.clause({
            src: ['$to_date'],
            op: ['>='],
            dst: undefined, // value is set by the issuer
          }),
        ],
      }),
    }),
  },
};
