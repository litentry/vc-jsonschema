import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('2-litentry-discord-member/1-1-0.json'),

  title: 'Litentry Discord Member',
  description:
    'The user is a member of Litentry Discord. Server link: https://discord.gg/phBSa3eMX9. Guild ID: 807161594245152800.',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of A2 assertion/ Litentry Discord Member',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$verified_discord_account'],
            op: ['>'],
            dst: ['0'],
          }),
          assertion.clause({
            src: ['$has_joined'],
            op: ['=='],
            dst: ['true'],
          }),
          assertion.clause({
            src: ['$discord_guild_id'],
            op: ['=='],
            dst: undefined, // client-defined value
          }),
        ],
      }),
    }),
  },
};
