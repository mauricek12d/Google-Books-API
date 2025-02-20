import { AuthenticationError } from 'apollo-server-express';
import  User  from '../models/User.js';
import { signToken } from '../services/auth.js';

interface ContextType {
  user?: { _id: string, username: string, email: string };
}

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: {username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: {input: any}, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (_parent: any, { bookId }: {bookId: string}, context: ContextType) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
