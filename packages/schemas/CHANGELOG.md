# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Schema Versioning](https://docs.snowplow.io/docs/pipeline-components-and-applications/iglu/common-architecture/schemaver/) (MODEL-REVISION-ADDITION).

## [Unreleased]

-

## 2024-07-09

(ADDITION) [`25-token-holding-amount`](./src/lib/25-token-holding-amount/) bumped to 1-1-3

- Supported new token: AN, TUNA.

(ADDITION) [`26-nft-holder`](./src/lib/26-nft-holder/) bumped to 1-1-1

- Supported new NFT: MFAN.

## 2024-05-13

(REVISION) [`25-token-holding-amount`](./src/lib/25-token-holding-amount/) bumped to 1-1-1

- Update Support tokens address.

## 2024-05-13

(REVISION) [`25-token-holding-amount`](./src/lib/25-token-holding-amount/) bumped to 1-1-1

- Support tokens: `Ada`, `Doge`, `Shib`, `Uni`, `Bch`, `Etc`, `Atom`, `Dai`, `Leo`, `Fil`, `Imx`, `Cro`, `Inj`.

## 2024-05-10

(ADDITION) [`24-platform-user`](./src/lib/24-platform-user/) bumped to 1-1-s1

- Support `MagicCraft` platform.

## 2024-04-30

(REVISION) [`25-token-holding-amount`](./src/lib/25-token-holding-amount/) bumped to 1-1-0

- Updated the single `supportedNetworks` condition to wrap by `and`

## 2024-04-29

(ADDITION) [`6-twitter-follower-amount`](./src/lib/6-twitter-follower-amount/) bumped to 1-1-1

- Updated the variable `total_followers` to support any numbers

(MODEL) [`25-token-holding-amount`](./src/lib/25-token-holding-amount/) initial to 1-0-0

## 2024-04-25

(ADDITION) [`21-evm-holding-amount`](./src/lib/21-evm-holding-amount/) bumped to 1-1-1

- Support `MCRT` token.

## 2024-04-02

(ADDITION) Schema [`21-evm-holding-amount`](./src//lib/21-evm-holding-amount/) bumped to 1-1-1

- Added support for the MCRT token and Solana network.

## 2024-03-18

(REVISION) All schemas bumped to 1-1-0

- Added `issuer.runtimeVersion` property
  - optional for backwards compatibility

## [1-0-0] - 2024-02-10

Initial version
