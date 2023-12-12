import type { JSONSchema7 } from 'json-schema';

/**
 * JSONSchema to represent JSON formats like:
 * ```json
 * {
 *  and: [{ ... }, { ... }]
 * }
 * ```
 */
export const and = (args: { items: JSONSchema7[] }): JSONSchema7 => ({
  type: 'object',
  required: ['and'],
  properties: {
    and: {
      type: 'array',
      minItems: args.items.length,
      maxItems: args.items.length,
      items: args.items,
    },
  },
});

/**
 * JSONSchema to represent JSON formats like:
 * ```json
 * {
 *  or: [{ ... }, { ... }]
 * }
 * ```
 */
export const or = (args: { items: JSONSchema7[] }): JSONSchema7 => ({
  type: 'object',
  required: ['or'],
  properties: {
    or: {
      type: 'array',
      minItems: args.items.length,
      maxItems: args.items.length,
      items: args.items,
    },
  },
});

/**
 *
 * JSONSchema to represent JSON formats like:
 * ```json
 * {
 *  "src": "$has_web2_account",
 *  "op": "==",
 *  "dst": "true"
 * }
 * ```
 *
 */
export const clause = (args: {
  src: string;
  op: string;
  dst: string;
}): JSONSchema7 => ({
  type: 'object',
  required: ['src', 'op', 'dst'],
  properties: {
    src: {
      type: 'string',
      enum: [args.src],
    },
    op: {
      type: 'string',
      enum: [args.op],
    },
    dst: {
      type: 'string',
      enum: [args.dst],
    },
  },
});
