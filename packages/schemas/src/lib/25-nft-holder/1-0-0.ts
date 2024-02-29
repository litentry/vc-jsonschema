import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// Reference:
// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials-v2/src/nft_holder/mod.rs

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('25-nft-holder/1-0-0.json'),

  title: 'Generic NFT Holder',
  description: 'You are a holder of a certain kind of NFT',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Generic NFT Holder',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$nft'],
            op: ['=='],
            dst: ['Weirdo Ghost Gang', 'Club3 SBT'],
          }),
          assertion.or({
            minItems: 1,
            maxItems: 3, // max(Weirdo Ghost Gang, Club3 SBT)
            items: assertion.and({
              items: [
                assertion.clause({
                  src: ['$network'],
                  op: ['=='],
                  dst: ['bsc', 'polygon', 'arbitrum'],
                }),
                assertion.clause({
                  src: ['$address'],
                  op: ['=='],
                  dst: [
                    '0x9f488C0dafb1B3bFeeD3e886e0E6E5f3f4517925',
                    '0xAc2e4e67cffa5E82bfA1e169e5F9aa405114C982',
                    '0xcccFF19FB8a4a2A206d07842b8F8c8c0A11904C2',
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    }),
  },
};
