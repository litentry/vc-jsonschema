import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath(
    '9-polkadot-governance-participation-proof/1-0-0.json'
  ),

  title: 'Polkadot Governance Participation Proof',
  description:
    'The user has participated in any Polkadot on-chain governance events',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of A14 assertion/ Polkadot Governance Participation Proof',
      assertions: assertion.clause({
        src: ['$total_governance_action'],
        op: ['>'],
        dst: ['0'],
      }),
    }),
  },
};
