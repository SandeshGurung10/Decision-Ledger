import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const adminSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Database connected');
    
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        passwordConfirm: process.env.ADMIN_PASSWORD, 
        role: "Admin",
        department: process.env.ADMIN_DEPARTMENT
      });
      console.log("Admin created!");
      console.log("Email:", process.env.ADMIN_EMAIL);
    } else {
      console.log("Admin already exists!");
      console.log("Email:", process.env.ADMIN_EMAIL);
    }
    
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
    
  } catch (err) {
    console.error("Error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

adminSeeder();