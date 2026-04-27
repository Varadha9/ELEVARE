// Import mongoose — ODM library used to connect and interact with MongoDB
import mongoose from 'mongoose';

// connectDB — called once at server startup to establish MongoDB connection
// Using async/await because mongoose.connect returns a Promise
const connectDB = async () => {
  try {
    // Connect using the URI from .env (e.g. mongodb://localhost:27017/elevare)
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Log the host so we can confirm which DB server we connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    // process.exit(1) stops the server — no point running without a database
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
