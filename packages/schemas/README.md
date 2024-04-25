# schemas

This library is a collection of Litentry Verifiable Credential's schema definitions.

- The schemas are described using the [JSONSchema specification](https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-01)
- The schemas are developed using TypeScript. Check the [`lib`](./src/lib/).
- The TypeScript code yield JSON files. These JSON files' URLs are embedded into VCs. Check the [`dist`](../../dist/schemas/) folder.
- Take a look at the [`examples`](../../examples/) folder in the root. It has examples of all issued VCs.

## Development

## Versioning

The schemas in this package are versioned following **SchemaVer**. This is `MODEL`-`REVISION`-`ADDITION` versioning. [Learn more](https://snowplow.io/blog/introducing-schemaver-for-semantic-versioning-of-schemas/)

## Generating JSONs

Run `nx run schemas:generate` to generate the schema files.
