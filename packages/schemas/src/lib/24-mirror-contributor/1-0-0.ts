import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('24-mirror-contributor/1-0-0.json'),

  title: 'Mirror Contributor',
  description:
    'You are a publisher on Mirror / You have published a certain amount of posts on Mirror',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Mirror publisher',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$is_publication_on_mirror', '$has_post_on_mirror'],
            op: ['=='],
            dst: ['true'],
          }),
        ],
      }),
    }),
  },
};
