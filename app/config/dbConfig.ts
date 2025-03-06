import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("⚠️ MongoDB connection string is missing from environment variables!");
}

export async function connect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Using existing MongoDB connection.");
      return;
    }

    await mongoose.connect(MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    mongoose.connection.on("connected", () => console.log("✅ MongoDB connected."));
    mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));

    return mongoose.connection;
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}