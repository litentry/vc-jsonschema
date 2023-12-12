import { JSONSchema7 } from 'json-schema';

import { resolveGitHubPath } from '../helpers';
import {
  schema as base,
  credentialSubjectWithAssertions,
  claim,
} from '../0-base/1-0-0';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('a3/1-0-0.json'),

  title: 'Active Discord ID-Hubber',
  description:
    'You have commented in Litentry Discord #🪂id-hubber channel. Channel link: https://discord.com/channels/807161594245152800/1093886939746291882',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubjectWithAssertions({
      type: 'object',
      required: ['and'],
      properties: {
        and: {
          type: 'array',
          minItems: 5,
          maxItems: 5,
          items: [
            claim({
              src: '$has_role',
              op: '==',
              dst: 'true',
            }),
            claim({
              src: '$has_commented',
              op: '==',
              dst: 'true',
            }),
            claim({
              src: '$discord_guild_id',
              op: '==',
              dst: '10',
            }),
            claim({
              src: '$discord_channel_id',
              op: '==',
              dst: '10',
            }),
            claim({
              src: '$discord_role_id',
              op: '==',
              dst: '10',
            }),
          ],
        },
      },
    }),
  },
};
