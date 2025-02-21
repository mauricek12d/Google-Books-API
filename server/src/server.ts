import express, { Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/connection.js';
import routes from './routes/index.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import jwt from 'jsonwebtoken'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication
app.use(authenticateToken); // ✅ Enable authentication middleware

const secretKey = process.env.JWT_SECRET_KEY || 'supersupersecretkey';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log("Incoming Headers:", req.headers);
    let token = req.headers.authorization || '';
    console.log("extracted Token:", token);
    
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      console.log("No Token Found");
      return { user: null };
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      console.log("Decoded Token:", decoded);
      return { user: decoded };
    } catch (error) {
      console.warn("Invalid Token:", error);
      return { user: null };
    } 
  }
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware ({ app: app as any });

  // If in production, serve static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));

    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
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
