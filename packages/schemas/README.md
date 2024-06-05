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

## FAQ

### Should I modify an existing schema or create a new version?

In general, creating a new version is always preferred.

An exception to the rule, is when the Verifiable Credential for which the schema was created, hasn't been used by any user. I.e., no user has ever requested such assertion.

### What base schema should I use when creating a new schema?

Use always the latest available base from `packages/schemas/lib/base`.

### When to create a new version of base?

New versions for base schemas should be done whenever there is a broad change(s) for all or most schemas. For instance, a new field.

A new base also implies new version for all and each schema to use the new base schema.

### The version of the schema doesn't match the base schema's version.

Base schema versions are detached from schemas. As explained above, schemas will always use the latest available base and base schemas will only increment in version when the change is broad enough to affect all schemas. Therefore, base schema version won't necessarily match schema's versions

### What tests should cover?

The schema's tests are located in `packages/schemas/__tests__`. They should assert:

1. base schemas 1-0-0 should be able to validate all 1-0-0 examples.
1. base schema 1-1-0 (latest) should be able to validate all examples.
1. Given a schema version, it should validate successfully all it's current and past versions.
