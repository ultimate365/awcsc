import mongoose from "mongoose";

type ConnectionObjected = {
  isConnected?: number;
};

const connection: ConnectionObjected = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }
  try {
    const db = await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb://amtawestsports:aredyGbRMtYVgFlR@ac-qh7ppgr-shard-00-00.8glfa0t.mongodb.net:27017,ac-qh7ppgr-shard-00-01.8glfa0t.mongodb.net:27017,ac-qh7ppgr-shard-00-02.8glfa0t.mongodb.net:27017/awcsc?ssl=true&replicaSet=atlas-ailzos-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
      {}
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to Database");
  } catch (error) {
    console.log("Database Connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
