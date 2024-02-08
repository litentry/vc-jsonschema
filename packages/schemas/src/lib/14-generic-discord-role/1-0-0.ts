import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('15-generic-discord-role/1-0-0.json'),

  title: 'You have certain role on Litentry Official Discord Server.',
  description:
    'You have a role that entitles you as "Litentry & Contest Legend", "Litentry & Popularity Award of Score Contest", "Litentry & Contest Participant", "Litentry & SORA Quiz Attendee", or "Litentry & SORA Quiz Master"',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of GenericDiscordRole/ Litentry Discord Contests/ Litentry & SORA Quiz',
      assertions: assertion.clause({
        src: [
          '$is_contest_legend',
          '$is_contest_popularity',
          '$is_contest_participant',
          '$is_attendee',
          '$is_master',
        ],
        op: ['=='],
        dst: ['true'],
      }),
    }),
  },
};
