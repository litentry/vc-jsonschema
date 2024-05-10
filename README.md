# vc-jsonschema

A place to hold all existing JSONSchemas for VC.

It contains:

- `example` directory: exemplary VC for each assertion type
- `packages/schema` directory: JSONSchema for each assertion type
- `packages/validator` directory: Utility to validate schemas from a VC string.

## Contributing

1. Locate the schema you want to update on `packages/schema`. You can tell it from the VC's `credentialSchema.id` value.
1. Follow the versioning described in `packages/schema`'s README to name the new version.
1. The README describes how to generate the schemas from its model too.
1. Update the CHANGELOG.
1. Publish the pull request.
