import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('a3/1-0-0.json'),

  title: 'Active Discord ID-Hubber',
  description:
    'You have commented in Litentry Discord #🪂id-hubber channel. Channel link: https://discord.com/channels/807161594245152800/1093886939746291882',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: '$has_role',
            op: '==',
            dst: 'true',
          }),
          assertion.clause({
            src: '$has_commented',
            op: '==',
            dst: 'true',
          }),
          assertion.clause({
            src: '$discord_guild_id',
            op: '==',
            dst: '10',
          }),
          assertion.clause({
            src: '$discord_channel_id',
            op: '==',
            dst: '10',
          }),
          assertion.clause({
            src: '$discord_role_id',
            op: '==',
            dst: '10',
          }),
        ],
      }),
    }),
  },
};
