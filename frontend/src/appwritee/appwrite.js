
import { Client, Account,Storage,Databases } from "appwrite";



const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);


client.setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject('67458dd70030fdd03393');// Replace with your project ID

export { client, account,storage,databases };

