import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('21-vip3-card-holder/1-0-0.json'),

  title: 'VIP3 Gold/ Silver Card Holder',
  description: 'You are VIP3 Gold/ Silver Card Holder',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of VIP3 Gold/ Silver Card Holder',
      assertions: assertion.clause({
        src: ['$is_gold_card', '$is_silver_card'],
        op: ['=='],
        dst: ['true'],
      }),
    }),
  },
};
