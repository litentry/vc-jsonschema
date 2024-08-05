import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

const supportedTokens = [
  // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/litentry_profile/token_balance.rs
  '$wbtc_holding_amount',
  '$lit_holding_amount',
  '$usdc_holding_amount',
  '$usdt_holding_amount',
  '$crv_holding_amount',
  '$matic_holding_amount',
  '$dydx_holding_amount',
  '$amp_holding_amount',
  '$cvx_holding_amount',
  '$tusd_holding_amount',
  '$usdd_holding_amount',
  '$gusd_holding_amount',
  '$link_holding_amount',
  '$grt_holding_amount',
  '$comp_holding_amount',
  '$people_holding_amount',
  '$gtc_holding_amount',
  // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/litentry_profile/holding_amount.rs
  '$eth_holding_amount',
  // https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/achainable/lit_holding_amount.rs
  'lit_holding_amount',
  /// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/litentry_profile/lit_staking.rs
  '$lit_staking_amount',

  '$ada_holding_amount',
  '$doge_holding_amount',
  '$shib_holding_amount',
  '$uni_holding_amount',
  '$bch_holding_amount',
  '$etc_holding_amount',
  '$atom_holding_amount',
  '$dai_holding_amount',
  '$leo_holding_amount',
  '$fil_holding_amount',
  '$imx_holding_amount',
  '$cro_holding_amount',
  '$inj_holding_amount',
];

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('17-token-holding-amount/1-1-2.json'),

  title: 'Token holding amount',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount',
      assertions: assertion.and({
        minItems: 1,
        maxItems: 2,
        items: [
          assertion.clause({
            src: supportedTokens,
            op: ['>', '>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
          assertion.clause({
            src: supportedTokens,
            op: ['<'],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
      }),
    }),
  },
};
