import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('25-crypto-summary/1-0-0.json'),

  title: 'Token holding amount',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$total_txs'],
            op: ['=='],
            dst: undefined, // number literal of total transactions
          }),
          // tokens
          assertion.and({
            minItems: 1,
            maxItems: 3, // $kind, $network:eth, $network:bsc
            items: [
              assertion.clause({
                src: ['$kind'],
                op: ['=='],
                dst: ['TOKEN'],
              }),
            ],
            additionalItems: true,
          }),
          // nft
          assertion.and({
            minItems: 1,
            maxItems: 2, // $kind, $network:eth
            items: [
              assertion.clause({
                src: ['$kind'],
                op: ['=='],
                dst: ['NFT'],
              }),
            ],
            additionalItems: true,
          }),
        ],
      }),
    }),
  },
};
