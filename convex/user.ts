import {v} from 'convex/values';
import {mutation, query} from './_generated/server';
import {Id} from './_generated/dataModel';

export const createUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('address'), args.address))
      .collect();
    if (users.length === 0) {
      const userId = await ctx.db.insert('users', {address: args.address});
      return userId.toString();
    } else {
      return users[0]._id;
    }
  },
});

export const updateUser = mutation({
  args: {
    user: v.id('users'),
    address: v.optional(v.string()),
    primaryAddress: v.optional(v.string()),
    username: v.optional(v.string()),
    mint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.user, {
      address: args.address,
      primaryAddress: args.primaryAddress,
      username: args.username,
      mint: args.mint,
    });
  },
});

export const getUser = query({
  args: {
    id: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let users;
    if (args.id) {
      users = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('_id'), args.id as Id<'users'>))
        .collect();
    } else if (args.address) {
      users = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('address'), args.address))
        .collect();
    }
    if (!users || !users[0]) {
      return null;
    }

    return users[0];
  },
});
