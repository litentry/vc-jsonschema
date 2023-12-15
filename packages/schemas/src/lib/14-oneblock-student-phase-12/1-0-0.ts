import { JSONSchema7 } from 'json-schema';

import { schema as base } from '../0-base/1-0-0';
import { resolveGitHubPath } from '../helpers';
import { credentialSubject, assertion } from '../schema-helpers';

export const schema: JSONSchema7 = {
  ...base,

  $id: resolveGitHubPath('14-oneblock-student-phase-12/1-0-0.json'),

  title: 'OneBlock+ Student Phase 12',
  description:
    'You participated/ completed/ were an "outstanding student" in the course co-created by OneBlock+ and Parity: "Introduction to Substrate Blockchain Development, Phase 12"',

  properties: {
    ...base.properties,

    credentialSubject: credentialSubject({
      title: 'Credential Subject of OneBlock+ Students Phase 12',
      assertions: assertion.clause({
        src: [
          '$course_participated',
          '$course_completed',
          '$outstanding_student',
        ],
        op: ['=='],
        dst: ['true'],
      }),
    }),
  },
};
