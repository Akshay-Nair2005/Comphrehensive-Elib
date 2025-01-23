import React, { useEffect, useState } from "react";
import { account, storage } from "../../appwritee/appwrite"; // Ensure correct Appwrite instance is imported
import { FaCamera } from "react-icons/fa";
import { ID } from "appwrite";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("reader"); // Default to reader
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user details on load
    const fetchUserDetails = async () => {
      try {
        const userDetails = await account.get();
        setUser(userDetails);
        setName(userDetails.name);
        setUserType(userDetails.prefs.userType || "reader"); // Default to reader if not set
        setProfilePhoto(userDetails.prefs.profilePhoto || "");
      } catch (error) {
        console.error("Failed to fetch user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    try {
      await account.updateName(name); // Update name
      await account.updatePrefs({ userType, profilePhoto }); // Update preferences
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
      alert("No file selected. Please choose a file.");
      return;
    }

    try {
      const uploadResponse = await storage.createFile(
        "678df3f6000187260af8", // Replace with your bucket ID
        ID.unique(), // Generate a valid, unique file ID
        file
      );

      const fileURL = storage.getFilePreview(
        "678df3f6000187260af8",
        uploadResponse.$id
      );
      setProfilePhoto(fileURL);
      alert("Profile photo uploaded successfully!");
    } catch (error) {
      alert("Failed to upload profile photo: " + error.message);
    }
  };

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <div className="relative flex flex-col items-center mb-8">
          <div className="relative w-28 h-28">
            <img
              src={profilePhoto || "/images/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-orange-600 shadow-md object-cover"
            />
            {isEditing && (
              <label
                htmlFor="upload-photo"
                className="absolute bottom-0 right-0 bg-orange-600 text-white rounded-full p-2 cursor-pointer shadow-lg"
              >
                <FaCamera className="w-4 h-4" />
                <input
                  type="file"
                  id="upload-photo"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b border-gray-300 focus:outline-none focus:border-orange-600 text-center"
              />
            ) : (
              user.name
            )}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <label className="block text-gray-700 font-medium mb-2">
              Are you a Reader or Writer?
            </label>
            {isEditing ? (
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full max-w-xs border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="reader">Reader</option>
                <option value="writer">Writer</option>
              </select>
            ) : (
              <span className="text-gray-700 font-semibold">{userType}</span>
            )}
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-orange-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-700 transition duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
