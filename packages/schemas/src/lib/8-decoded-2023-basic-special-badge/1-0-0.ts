import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('8-decoded-2023-basic-special-badge/1-0-0.json'),

  title: 'Decoded 2023 Basic Special Badge',
  description:
    'The user has a Polkadot Decoded 2023 Litentry Booth Special Badge',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of A13 assertion/ Decoded 2023 Basic Special Badge',
      assertions: assertion.clause({
        src: ['$has_claimed_badge'],
        op: ['=='],
        dst: ['true'],
      }),
    }),
  },
};
