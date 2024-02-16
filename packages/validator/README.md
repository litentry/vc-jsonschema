# @litentry/vc-schema-validator

A library to validate Litentry Verifiable Credential against their schema.

The Litentry protocol issues Verifiable Credentials for different type of claims. Based on the claim, the Verifiable Credential schema will change.

The [vc-jsonschema repository](https://github.com/litentry/vc-jsonschema) collects all the schemas that can be generated and the expected data types of each field.

Litentry Verifiable Credentials include a link to their schema on the `credentialSubject.id` property. The utilities on this package allow validating that schema against the Verifiable Credential.

## Install

```bash
npm install @litentry/vc-schema-validator
```

## Example

```ts
import { validateVcSchema } from '@litentry/vc-schema-validator';

// the vc's json string
const vc: string = '{"@context":["https://www.w3.org/2018/credentials/v1",..';

// validate the vc
const { isValid, errors } = await validateVcSchema(vc);

if (isValid) {
  console.log('The VC is valid');
} else {
  console.log('The VC is invalid:', errors);
}
```
