import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js"; 

dotenv.config();

const db = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks";

// Connect to MongoDB
mongoose.connect(db)
  .then(() => { 
    console.log("✅ MongoDB connected");
  })
  .catch((error) => { 
    console.error("❌ Database connection failed:", error);
  });

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear existing users
    console.log("⚠️ Old users removed!");

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create([
      { username: "Murph", email: "Murph@gmail.com", password: hashedPassword },
      { username: "TestUser", email: "testuser@gmail.com", password: hashedPassword }
    ]);

    console.log("✅ Users seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    mongoose.connection.close(); // Close connection when done
  }
};

seedUsers();
