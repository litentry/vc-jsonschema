import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('4-token-holding-time/1-0-0.json'),

  title: 'Token Holding Time',
  description: 'The number of tokens you hold > 0',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$minimum_amount',
            op: '==',
            dst: undefined, // values can vary
          }),
          assertion.clause({
            src: '$from_date',
            op: '<',
            dst: undefined, // values can vary
          }),
          assertion.clause({
            src: '$to_date',
            op: '>=',
            dst: undefined, // values can vary
          }),
        ],
      }),
    }),
  },
};
