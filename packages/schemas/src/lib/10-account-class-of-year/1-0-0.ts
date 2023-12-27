import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('10-account-class-of-year/1-0-0.json'),

  title: 'Account Class Of Year',
  description:
    'The class of year that the user account was created on a particular network (must have on-chain records)',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of Achainable assertion/ Account Class Of Year',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$account_created_year'],
            op: ['=='],
            dst: undefined, // Integer literal or "Invalid"
          }),
        ],
      }),
    }),
  },
};
