/**
 * Adds `DarenMarket` platform.
 */

import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

const supportedPlatforms = [
  // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials-v2/src/platform_user/mod.rs
  'KaratDao',
  'MagicCraft',
  'DarenMarket',
];

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('24-platform-user/1-1-2.json'),

  title: 'Platform user',
  description: 'You are a user of a certain platform',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Platform user',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$platform'],
            op: ['=='],
            dst: supportedPlatforms,
          }),
        ],
      }),
    }),
  },
};
