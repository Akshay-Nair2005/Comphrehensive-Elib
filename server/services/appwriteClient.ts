import { Client, Databases } from "appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT || "")
    .setProject(process.env.VITE_PROJECT_ID || "");

export const databases = new Databases(client);
