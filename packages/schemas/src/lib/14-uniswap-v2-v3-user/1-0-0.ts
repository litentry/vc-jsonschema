import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('14-uniswap-v2-v3-user/1-0-0.json'),

  title: 'You are a trader or liquidity provider of Uniswap V2 or V3.',
  description:
    'You are a trader or liquidity provider of Uniswap V2 or V3. Uniswap V2 Factory Contract: 0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f. Uniswap V3 Factory Contract: 0x1f98431c8ad98523631ae4a59f267346ea31f984.", "Uniswap V2/V3 User"',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Achainable/ Uniswap V2/V3 User',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$is_uniswap_v2_user'],
            op: ['=='],
            dst: ['true', 'false'],
          }),
          assertion.clause({
            src: ['$is_uniswap_v3_user'],
            op: ['=='],
            dst: ['true', 'false'],
          }),
        ],
      }),
    }),
  },
};
