import { Client } from "appwrite";
import dotenv from "dotenv";

const sdk = require('node-appwrite');

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_ENDPOINT || "")
  .setProject(process.env.VITE_PROJECT_ID || "");

const users = new sdk.Users(client);

const databases = new sdk.Databases(client);

export { users, databases };
