import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('12-idhub-evm-version-early-bird/1-1-0.json'),

  title: 'IDHub EVM Version Early Bird',
  description:
    'The user is an early bird user of the IdentityHub EVM version and has generated at least 1 credential during 2023 Aug 14th ~ Aug 21st.',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of A20/ IDHub EVM Version Early Bird',
      assertions: assertion.clause({
        src: ['$has_joined'],
        op: ['=='],
        dst: ['true', 'false'],
      }),
    }),
  },
};
