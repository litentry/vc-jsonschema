import { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';
import {
  schema as base,
  credentialSubjectWithAssertions,
  claim,
} from '../0-base/1-0-0';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('a2/1-0-0.json'),

  title: 'Litentry Discord Member',
  description:
    'The user is a member of Litentry Discord. Server link: https://discord.gg/phBSa3eMX9. Guild ID: 807161594245152800.',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubjectWithAssertions({
      title: 'Litentry Discord Member',
      type: 'object',
      required: ['and'],
      properties: {
        and: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: [
            claim({
              src: '$verified_discord_account',
              op: '>',
              dst: '0',
            }),
            claim({
              src: '$has_joined',
              op: '==',
              dst: 'true',
            }),
            claim({
              src: '$discord_guild_id',
              op: '==',
              dst: 'abc',
            }),
          ],
        },
      },
    }),
  },
};
