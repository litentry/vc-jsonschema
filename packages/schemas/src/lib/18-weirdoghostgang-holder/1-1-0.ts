import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('18-weirdoghostgang-holder/1-1-0.json'),

  title: 'WeirdoGhostGang Holder',
  description: 'You are WeirdoGhostGang NFT holder',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of NodeReal/ WeirdoGhostGang Holder',
      assertions: assertion.clause({
        src: ['$is_weirdo_ghost_gang_holder'],
        op: ['=='],
        dst: ['true'],
      }),
    }),
  },
};
