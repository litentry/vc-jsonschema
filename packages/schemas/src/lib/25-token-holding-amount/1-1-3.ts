/**
 * Changes:
 * - Add Bean token on Bsc and on Combo
 * - Add Combo network to supportedNetworks
 * - Support the omission of the `$holding_amount < x` assertion's clause
 */

import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-1-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// Token names: https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/common/src/web3_token/mod.rs
// Networks: https://github.com/litentry/litentry-parachain/blob/dev/primitives/core/src/assertion/web3_token.rs
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
  // Ethereum, Bsc, Solana, Arbitrum, Polygon
  USDC: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
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
  // Bsc, Ethereum
  SOL: [
    '0x570a5d26f7765ecb712c0924e4de545b89fd43df',
    '0x5288738df1aeb0894713de903e1d0c001eeb7644',
  ],
  // Bsc, Ethereum, Solana
  MCRT: [
    '0x4b8285aB433D8f69CB48d5Ad62b415ed1a221e4f',
    '0xde16ce60804a881e9f8c4ebb3824646edecd478d',
    'FADm4QuSUF1K526LvTjvbJjKzeeipP6bj5bSzp3r6ipq',
  ],
  BTC: [],
  // Bsc
  ADA: ['0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47'],
  // Bsc
  DOGE: ['0xba2ae424d960c26247dd6c32edc70b295c744c43'],
  // Ethereum
  SHIB: ['0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'],
  // Ethereum, Bsc, Solana, Arbitrum, Polygon
  UNI: [
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
    '8FU95xFJhUUkyyCLU13HSzDLs7oC4QZdXQHL6SCeab36',
    '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
  ],
  // Bsc
  BCH: ['0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf'],
  // Bsc
  ETC: ['0x3d6545b08693dae087e957cb1180ee38b9e3c25e'],
  // Ethereum, Bsc, Polygon
  ATOM: [
    '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    '0x0eb3a705fc54725037cc9e008bdede697f62f335',
    '0xac51C4c48Dc3116487eD4BC16542e27B5694Da1b',
  ],
  // Ethereum, Bsc, Polygon, Solana, Arbitrum
  DAI: [
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o',
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  ],
  // Ethereum
  LEO: ['0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3'],
  // Bsc
  FIL: ['0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153'],
  // Ethereum
  IMX: ['0xf57e7e7c23978c3caec3c3548e3d615c346e79ff'],
  // Ethereum, Solana
  CRO: [
    '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
    'DvjMYMVeXgKxaixGKpzQThLoG98nc7HSU7eanzsdCboA',
  ],
  // Ethereum, Bsc
  INJ: [
    '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
    '0xa2b726b1145a4773f68593cf171187d8ebe4d495',
  ],
  // Bsc, Combo:
  BEAN: [
    '0x07da81e9a684ab87fad7206b3bc8d0866f48cc7c',
    '0xba7b9936a965fac23bb7a8190364fa60622b3cff',
  ],
  // Bsc
  AN: ['0x68d806380ce01e994f7583d796d0aea9ab470219'],
  // Ethereum
  TUNA: ['0xadd353fb2e2c563383ff3272a500f3e7134dafe4'],
};

const supportedNetworks = [
  'bsc',
  'bitcoin_p2tr',
  'bitcoin_p2pkh',
  'bitcoin_p2sh',
  'bitcoin_p2wpkh',
  'bitcoin_p2wsh',
  'ethereum',
  'litentry',
  'litmus',
  'solana',
  'arbitrum',
  'polygon',
  'combo',
];

const tokenAddresses = Object.values(supportedTokens).flat();

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('25-token-holding-amount/1-1-3.json'),

  title: 'Token holding amount',
  description: 'The amount of a particular token you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of Token holding amount',
      assertions: assertion.and({
        minItems: 3,
        maxItems: 4,
        items: [
          assertion.clause({
            src: ['$token'],
            op: ['=='],
            dst: Object.keys(supportedTokens),
          }),
          assertion.or({
            items: {
              anyOf: [
                assertion.and({
                  items: [
                    assertion.clause({
                      src: ['$network'],
                      op: ['=='],
                      dst: supportedNetworks,
                    }),
                  ],
                }),
                assertion.and({
                  // describes the list, no strict items count check
                  items: [
                    assertion.clause({
                      src: ['$network'],
                      op: ['=='],
                      dst: supportedNetworks,
                    }),
                    assertion.clause({
                      src: ['$address'],
                      op: ['=='],
                      dst: tokenAddresses,
                    }),
                  ],
                }),
              ],
            },
          }),
          assertion.clause({
            src: ['$holding_amount'],
            op: ['>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
        additionalItems: assertion.clause({
          src: ['$holding_amount'],
          op: ['<'],
          dst: undefined, // Amount, can be any number. Format is a string.
        }),
      }),
    }),
  },
};
