import { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';
import {
  schema as base,
  credentialSubjectWithAssertions,
  clause,
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
      type: 'object',
      required: ['and'],
      properties: {
        and: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: [
            clause({
              src: '$verified_discord_account',
              op: '>',
              dst: '0',
            }),
            clause({
              src: '$has_joined',
              op: '==',
              dst: 'true',
            }),
            clause({
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
