import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('17-bnb-3d-4d-club-domain-holding-amount/1-0-0.json'),

  title: 'BNB 3D/4D club domain holding amount.',
  description: 'The amount of .BNB 999/10k club domains you are holding',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title:
        'Credential Subject of BnbDigitDomainClub/ BNB 3D/4D club domain holding amount.',
      assertions: assertion.and({
        items: [
          assertion.clause({
            src: ['$999_club_member', '$10k_club_member'],
            op: ['>='],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
          assertion.clause({
            src: ['$999_club_member', '$10k_club_member'],
            op: ['<'],
            dst: undefined, // Amount, can be any number. Format is a string.
          }),
        ],
      }),
    }),
  },
};
