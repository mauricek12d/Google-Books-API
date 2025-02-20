import express, { Application } from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: {req: express.Request }) => authMiddleware({ req }),
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware ({ app: app as any });

  // If in production, serve static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes); // Keep REST routes if needed

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();
