import { useEffect, useState } from "react";
import { databases, client, account, storage } from "../../appwritee/appwrite";
import { ID } from "appwrite";
import { FaPaperPlane } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { RiFileUploadLine } from "react-icons/ri";
import Navv from "../../components/LinkComponents/Navv";

const DATABASE_ID = "674ad544002c56d61b63";
const COLLECTION_ID = "67ab0db300206486f186";
const BUCKET_ID = "678df3f6000187260af8";
const PROJECT_ID = "67458dd70030fdd03393";

const UserChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [file, setFile] = useState(null);

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

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile({
      file: selectedFile,
      type: selectedFile.type, // Capture MIME type
      name: selectedFile.name, // Store file name
    });
  };

  const sendMessage = async () => {
    if ((!message.trim() && !file) || !userDetails) return;

    try {
      let fileurl = "";
      let filetype = "";
      let filename = "";

      if (file) {
        const fileId = ID.unique();
        const uploadResponse = await storage.createFile(
          BUCKET_ID,
          fileId,
          file.file
        );

        fileurl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${uploadResponse.$id}/view?project=${PROJECT_ID}&mode=admin`;
        filetype = file.type;
        filename = file.name;
      }

      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userid: userDetails.$id,
        message,
        timestamp: Date.now().toString(),
        username: userDetails.name,
        fileurl,
        filetype,
        filename,
      });

      setMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navv />
      <div className="flex-1 bg-gray-100 overflow-y-auto p-4 space-y-4">
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
                {userDetails.name || "Unknown"}
              </span>
              {msg.message && <p className="text-sm">{msg.message}</p>}

              {/* File Preview Logic */}
              {msg.fileurl && msg.filetype?.startsWith("image/") ? (
                <div>
                  <img
                    src={msg.fileurl}
                    alt="Uploaded file"
                    className="mt-2 max-w-xs rounded-md h-32 object-cover"
                  />
                  <div className="flex justify-end">
                    <a
                      href={msg.fileurl}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                    {/* <a
                      href={msg.fileurl}
                      download
                      className="text-green-500 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        const link = document.createElement("a");
                        link.href = msg.fileurl;
                        link.download = msg.filename || "download";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </a> */}
                  </div>
                </div>
              ) : msg.filetype === "application/pdf" ? (
                <div className="bg-gray-200 p-2 rounded-md mt-2 flex items-center">
                  <FaFileAlt size={24} className="text-gray-600" />{" "}
                  <p className="text-black">{msg.filename || "Document"}</p>
                  <a
                    href={msg.fileurl}
                    target="_blank"
                    className="ml-auto text-blue-500 underline"
                  >
                    View File
                  </a>
                </div>
              ) : msg.fileurl ? (
                <div className="bg-gray-200 p-2 rounded-md mt-2 flex items-center">
                  <FaFileAlt size={24} className="text-black" />{" "}
                  <p className="text-black">{msg.filename || "Unknown File"}</p>
                  <a
                    href={msg.fileurl}
                    target="_blank"
                    className="ml-auto text-blue-500 underline"
                  >
                    View
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center bg-white p-3 border-t shadow-md">
        <input
          type="file"
          accept="image/*, application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer text-blue-500 mr-2"
        >
          {/* 📎 */}
          <FaPaperclip size={20} className="text-gray-500" />
        </label>

        {file && (
          <div className="bg-gray-200 p-2 rounded-md flex items-center">
            {/* 📂  */}
            <FaFileAlt size={24} className="text-gray-600" />
            {file.name}
            <button className="ml-2 text-red-500" onClick={() => setFile(null)}>
              ✖
            </button>
          </div>
        )}

        <input
          type="text"
          className="flex-1 p-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent new line in input
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="ml-3 bg-[#5E3023] text-white p-3 rounded-full transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default UserChatRoom;
