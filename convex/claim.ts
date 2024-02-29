import {v} from 'convex/values';
import {mutation, query} from './_generated/server';
import {Id} from './_generated/dataModel';

export const createClaim = mutation({
  args: {
    user: v.id('users'),
    date: v.number(),
    mint: v.string(),
  },
  handler: async (ctx, args) => {
    const claimId = await ctx.db.insert('claims', {
      user: args.user,
      date: args.date,
      isBurned: false,
      mint: args.mint,
    });
    return claimId.toString();
  },
});

export const updateClaim = mutation({
  args: {
    id: v.id('claims'),
    user: v.id('users'),
    isBurned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const claim = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, {
      user: claim?.user,
      date: claim?.date,
      mint: claim?.mint,
      isBurned: args.isBurned,
    });
  },
});

export const getClaims = query({
  args: {
    id: v.optional(v.string()),
    startDate: v.number(),
    currentDate: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      let claimsQuery = ctx.db
        .query('claims')
        .filter(q => q.eq(q.field('user'), args.id as Id<'users'>));

      // claimsQuery = claimsQuery.filter(q =>
      //   q.and(
      //     q.gte(q.field('date'), args.startDate), // Filter claims after the specified date
      //     q.lte(q.field('date'), args.currentDate), // Filter claims before or on the current date
      //   ),
      // );

      const claims = await claimsQuery.collect();

      if (!claims || claims.length === 0) {
        return null;
      }

      return claims;
    } else {
      return null;
    }
  },
});
