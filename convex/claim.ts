import {v} from 'convex/values';
import {mutation, query} from './_generated/server';
import {Id} from './_generated/dataModel';

export const createClaim = mutation({
  args: {
    user: v.id('users'),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const claimId = await ctx.db.insert('claims', {
      user: args.user,
      date: args.date,
    });
    return claimId.toString();
  },
});

export const updateClaim = mutation({
  args: {
    id: v.id('claims'),
    user: v.id('users'),
    date: v.optional(v.number()),
    mint: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      user: args.user,
      date: args.date as number,
      mint: args.mint,
    });
  },
});

export const getClaims = query({
  args: {
    id: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const claims = await ctx.db
      .query('claims')
      .filter(q => q.eq(q.field('user'), args.id as Id<'users'>))
      .collect();

    if (!claims) {
      return null;
    }

    return claims;
  },
});
