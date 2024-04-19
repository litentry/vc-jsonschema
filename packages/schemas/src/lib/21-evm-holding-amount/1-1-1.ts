import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// Token names: https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials-v2/src/token_holding_amount/mod.rs
// Networks: https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/common/src/web3_token/mod.rs#L65
const supportedTokens = {
  // Ethereum
  BNB: ['0xb8c77482e45f1f44de1745f52c74426c631bdd52'],
  // Bsc
  ETH: ['0x2170ed0880ac9a755fd29b2688956bd959f933f8'],
  // Ethereum, Bsc
  SPACE_ID: ['0x2dff88a56767223a5529ea5960da7a3f5f766406'],
  // Ethereum, Bsc
  LIT: ['0xb59490ab09a0f526cc7305822ac65f2ab12f9723'],
  // Ethereum
  WBTC: ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'],
  // Ethereum, Bsc
  USDC: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  ],
  // Ethereum, Bsc
  USDT: [
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x55d398326f99059ff775485246999027b3197955',
  ],
  // Ethereum
  CRV: ['0xd533a949740bb3306d119cc777fa900ba034cd52'],
  // Ethereum, Bsc
  MATIC: [
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  ],
  // Ethereum
  DYDX: ['0x92d6c1e31e14520e676a687f0a93788b716beff5'],
  // Ethereum
  AMP: ['0xff20817765cb7f73d4bde2e66e067e58d11095c2'],
  // Ethereum
  CVX: ['0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b'],
  // Ethereum, Bsc
  TUSD: [
    '0x0000000000085d4780b73119b644ae5ecd22b376',
    '0x40af3827f39d0eacbf4a168f8d4ee67c121d11c9',
  ],
  // Ethereum, Bsc
  USDD: [
    '0x0c10bf8fcb7bf5412187a595ab97a3609160b5c6',
    '0xd17479997f34dd9156deef8f95a52d81d265be9c',
  ],
  // Ethereum
  GUSD: ['0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'],
  // Ethereum, Bsc
  LINK: [
    '0x514910771af9ca656af840dff83e8264ecf986ca',
    '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
  ],
  // Ethereum, Bsc
  GRT: [
    '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
  ],
  // Ethereum
  COMP: ['0xc00e94cb662c3520282e6f5717214004a7f26888'],
  // Ethereum
  PEOPLE: ['0x7a58c0be72be218b41c608b7fe7c5bb630736c71'],
  // Ethereum
  GTC: ['0xde30da39c46104798bb5aa3fe8b9e0e1f348163f'],
  // Ethereum, Bsc
  TON: [
    '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
    '0x76a797a59ba2c17726896976b7b3747bfd1d220f',
  ],
  // Ethereum, Bsc
  TRX: [
    '0x50327c6c5a14dcade707abad2e27eb517df87ab5',
    '0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3',
  ],
  // Bsc
  NFP: ['0x75e8ddb518bb757b4282cd5b83bb70d4101d12fb'],
  // Ethereum, Bsc, Solana
  MCRT: [
    '0xde16ce60804a881e9f8c4ebb3824646edecd478d',
    '0x4b8285aB433D8f69CB48d5Ad62b415ed1a221e4f',
    'FADm4QuSUF1K526LvTjvbJjKzeeipP6bj5bSzp3r6ipq',
  ],
};

const tokenAddresses = Object.values(supportedTokens).flat();

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('21-evm-holding-amount/1-1-1.json'),

  title: 'Token holding amount',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$token'],
            op: ['=='],
            dst: Object.keys(supportedTokens),
          }),
          assertion.or({
            items: assertion.and({
              // describes the list, no strict items count check
              items: [
                assertion.clause({
                  src: ['$network'],
                  op: ['=='],
                  dst: ['ethereum', 'bsc', 'solana'],
                }),
                assertion.clause({
                  src: ['$address'],
                  op: ['=='],
                  dst: tokenAddresses,
                }),
              ],
            }),
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['<'],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
      }),
    }),
  },
};
