import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();
const adminSeeder = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const adminExists = await User.findOne({ email: "admin@gmail.com" });
  
  if (!adminExists) {
    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      passwordConfirm: "Admin@123",
      role: "Admin",
      department: "Administration"
    });
    console.log("✅ Admin created!");
  } else {
    console.log("⚠️  Admin exists!");
  }
  
  mongoose.disconnect();
  process.exit();
};

adminSeeder().catch(err => {
  console.error("❌", err.message);
  process.exit(1);
});