import { useEffect, useState } from "react";
import { databases, client, account } from "../../appwritee/appwrite";
import { ID } from "appwrite";
import { FaPaperPlane } from "react-icons/fa";

const DATABASE_ID = "674ad544002c56d61b63";
const COLLECTION_ID = "67ab0db300206486f186";

function UserChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const user = await account.get();
        setUserDetails(user);

        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );
        setMessages(response.documents);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prev) => [...prev, response.payload]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !userDetails) return;

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userid: userDetails.$id,
        message,
        timestamp: Date.now().toString(),
        username: userDetails.name,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-[#5E3023] text-white text-lg font-semibold py-4 px-6 shadow-md sticky top-0">
        Novel Chat Room
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-[] overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.$id}
            className={`flex ${
              userDetails?.$id === msg.userid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                userDetails?.$id === msg.userid
                  ? "bg-[#5E3023] text-white"
                  : "bg-[#E1CDBB] text-black"
              }`}
            >
              <span className="block text-sm font-semibold">
                {msg.username || "Unknown"}
              </span>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center bg-white p-3 border-t shadow-md">
        <input
          type="text"
          className="flex-1 p-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-3  bg-button text-white p-3 rounded-full transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default UserChatRoom;
