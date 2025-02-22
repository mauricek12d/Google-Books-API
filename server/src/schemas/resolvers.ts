import { AuthenticationError } from 'apollo-server-express';
import  User  from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, { user }: any) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await User.findById(user._id);
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      console.log(`🔍 Checking user with email: ${email}`);
      const user = await User.findOne({ email });
      console.log('📌 Found User:', user); 
      
        if (!user) {
          console.warn('❌ User not found');
          throw new AuthenticationError('Incorrect credentials');
      }

      console.log(`🔑 Comparing password: ${password} with hashed: ${user.password}`);

      const isPasswordValid = await user.isCorrectPassword(password); 
      console.log('🔑 Password is valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.warn('❌ Password is invalid');
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, String(user._id));
      console.log('Token Generated:', token); 

      return { token, user };
    },
    
    addUser: async (_parent: any, { username, email, password }: {username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: {input: any}, { user }: any) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('Could not save book');
      }

      return updatedUser;
    },
    
    removeBook: async (_parent: any, { bookId }: {bookId: string}, { user }: any) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
