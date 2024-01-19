import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

// https://github.com/litentry/litentry-parachain/blob/dev/tee-worker/litentry/core/credentials/src/nodereal/crypto_summary/summary.rs
const supportedTokensEth = {
  PEPE: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  BLUR: '0x5283d291dbcf85356a21ba090e6db59121208b44',
  ARB: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  INJ: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
  AAVE: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  WLD: '0x163f8c2467924be0ae7b5347228cabf260318753',
  FTT: '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9',
  CAKE: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
  LIT: '0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723',
};

const supportedTokensBsc = {
  SHIB: '0xb1547683DA678f2e1F003A780143EC10Af8a832B',
  UNI: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  LINK: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
  ARB: '0xa050FFb3eEb8200eEB7F61ce34FF644420FD3522',
  BAT: '0x101d82428437127bF1608F699CD651e6Abf9766E',
  INJ: '0xa2B726B1145A4773F68593CF171187d8EBe4d495',
  AAVE: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
  FTT: '0x49BA054B9664e99ac335667a917c63bB94332E84',
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  LIT: '0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723',
};

const supportedNftEth = {
  'The Weirdo Ghost Gang': '0x9401518f4EBBA857BAA879D9f76E1Cc8b31ed197',
  Moonbirds: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
  Yogapetz: '0x142e03367eDE17Cd851477A4287D1F35676E6dC2',
  Mocaverse: '0x59325733eb952a92e069C87F0A6168b29E80627f',
  y00ts: '0xeC19CAeF9C046f5f87A497154766742ab9C90820',
  'The Sandbox': '0x5CC5B05a8A13E3fBDB0BB9FcCd98D38e50F90c38',
  'MATR1X KUKU': '0x596a5CD859AD53fEc23Cd3fCD77522f0B407920d',
  Doodles: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
  CloneX: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
  Nakamigos: '0xd774557b647330C91Bf44cfEAB205095f7E6c367',
  Opepen: '0x6339e5E072086621540D0362C4e3Cea0d643E114',
  'The Grapes': '0xe1dC516B1486Aba548eecD2947A11273518434a4',
  'The Captainz': '0x769272677faB02575E84945F03Eca517ACc544C',
  'The Potatoz': '0x39ee2c7b3cb80254225884ca001F57118C8f21B6',
  Meebits: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
};

const uniqueValues = (list: string[]): string[] => {
  return list.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

const supportedTokenNames = uniqueValues(
  Object.keys(supportedTokensEth).concat(Object.keys(supportedTokensBsc))
);

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
            additionalItems: assertion.and({
              minItems: 1,
              maxItems: 1 + supportedTokenNames.length,
              items: [
                assertion.clause({
                  src: ['$network'],
                  op: ['=='],
                  dst: ['Ethereum', 'Bsc'],
                }),
              ],
              additionalItems: assertion.and({
                items: [
                  assertion.clause({
                    src: ['$token_name'],
                    op: ['=='],
                    dst: supportedTokenNames,
                  }),
                  assertion.clause({
                    src: ['$token_address'],
                    op: ['=='],
                    dst: uniqueValues(
                      Object.values(supportedTokensEth).concat(
                        Object.values(supportedTokensBsc)
                      )
                    ),
                  }),
                ],
              }),
            }),
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
            additionalItems: assertion.and({
              minItems: 1,
              maxItems: 1 + Object.keys(supportedNftEth).length,
              items: [
                assertion.clause({
                  src: ['$network'],
                  op: ['=='],
                  dst: ['Ethereum'],
                }),
              ],
              additionalItems: assertion.and({
                items: [
                  assertion.clause({
                    src: ['$token_name'],
                    op: ['=='],
                    dst: Object.keys(supportedNftEth),
                  }),
                  assertion.clause({
                    src: ['$token_address'],
                    op: ['=='],
                    dst: Object.values(supportedNftEth),
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
    }),
  },
};
