import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('6-twitter-follower-amount/1-0-0.json'),

  title: 'Twitter Follower Amount',
  description: "The range of the user's Twitter follower count",

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$total_followers',
            op: '>',
            dst: '0',
          }),
          assertion.clause({
            src: '$total_followers',
            op: '<=',
            dst: '1',
          }),
        ],
      }),
    }),
  },
};
