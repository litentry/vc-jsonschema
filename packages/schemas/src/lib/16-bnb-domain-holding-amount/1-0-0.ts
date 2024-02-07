import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('16-bnb-domain-holding-amount/1-0-0.json'),

  title: 'BNB domain holding amount.',
  description: 'The amount of .bnb domain you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of BnbDomainHolding/ BNB domain holding amount.',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$bnb_domain_hoding_amount', '$bnb_domain_holding_amount'],
            op: ['>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
          assertion.clause({
            src: ['$bnb_domain_hoding_amount', '$bnb_domain_holding_amount'],
            op: ['<'],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
      }),
    }),
  },
};
