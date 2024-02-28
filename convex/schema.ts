import {defineSchema, defineTable} from 'convex/server';
import {v} from 'convex/values';

export default defineSchema({
  users: defineTable({
    address: v.string(),
    username: v.optional(v.string()),
    primaryAddress: v.optional(v.string()),
  }),
  claims: defineTable({
    user: v.id('users'),
    date: v.number(),
    mint: v.optional(v.string()),
  }),
});
