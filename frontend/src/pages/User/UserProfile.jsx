import React, { useEffect, useState } from "react";
import { account, storage } from "../../appwritee/appwrite"; // Ensure correct Appwrite instance is imported
import { FaCamera, FaBook, FaPenNib, FaSave, FaEdit } from "react-icons/fa";
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
    <div className="flex items-center justify-center min-h-screen bg-[#E1CDBB]">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative w-36 h-36">
              <img
                src={profilePhoto || "/images/default-avatar.png"}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-orange-600 shadow-lg object-cover"
              />
              {isEditing && (
                <label
                  htmlFor="upload-photo"
                  className="absolute bottom-2 right-2 bg-orange-600 text-white rounded-full p-3 cursor-pointer shadow-lg"
                >
                  <FaCamera className="w-5 h-5" />
                  <input
                    type="file"
                    id="upload-photo"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-gray-300 focus:outline-none focus:border-orange-600 text-gray-800 text-xl"
                  />
                ) : (
                  user.name
                )}
              </h1>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded-full">
                {userType}
              </span>
            </div>
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-orange-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 flex items-center gap-2"
            >
              <FaSave /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="bg-[#E1CDBB] text-center p-6 rounded-lg shadow-md">
            <FaBook className="text-4xl text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Books Read</h3>
            <p className="text-2xl font-bold text-gray-700">120</p>
          </div>
          <div className="bg-[#E1CDBB] text-center p-6 rounded-lg shadow-md">
            <FaPenNib className="text-4xl text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Books Written
            </h3>
            <p className="text-2xl font-bold text-gray-700">5</p>
          </div>
          <div className="bg-[#E1CDBB] text-center p-6 rounded-lg shadow-md">
            <FaCamera className="text-4xl text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Photos Uploaded
            </h3>
            <p className="text-2xl font-bold text-gray-700">15</p>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-[#f5f5f5] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Are you a Reader or Writer?
              </label>
              {isEditing ? (
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                </select>
              ) : (
                <span className="text-gray-700 font-semibold text-lg">
                  {userType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
