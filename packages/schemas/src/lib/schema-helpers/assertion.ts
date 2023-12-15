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
export const or = (args: {
  items: JSONSchema7 | JSONSchema7[];
}): JSONSchema7 => ({
  type: 'object',
  required: ['or'],
  properties: {
    or: {
      type: 'array',
      items: args.items,
      // strict tuple
      ...(Array.isArray(args.items)
        ? { minItems: args.items.length, maxItems: args.items.length }
        : {}),
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
 * `undefined` values will omit strict value checking
 * @example
 * ```ts
 * clause({
 *  src: '$date',
 *  op: '==',
 *  dst: undefined,
 * })
 * ```
 *
 * will output:
 *
 * ```json
 * {
 *   "type": "object",
 *   "required": [ "src", "op" ],
 *   "properties": {
 *     "src": {
 *       "type": "string",
 *       "enum": [ "$date" ]
 *     },
 *     "op": {
 *       "type": "string",
 *       "enum": [ "==" ]
 *     }
 *     "dst": {
 *       "type": "string",
 *     }
 *   }
 * }
 * ```
 */
export const clause = (args: {
  src: string | string[];
  op: string;
  dst: string | undefined;
}): JSONSchema7 => ({
  type: 'object',
  required: ['src', 'op', 'dst'],
  properties: {
    src: {
      type: 'string',
      enum: Array.isArray(args.src) ? args.src : [args.src],
    },
    op: {
      type: 'string',
      enum: [args.op],
    },
    dst: {
      type: 'string',
      enum: args.dst ? [args.dst] : undefined,
    },
  },
});
