import React, { useEffect, useState } from "react";
import { account, storage, databases } from "../../appwritee/appwrite";
import { FaCamera, FaSave, FaEdit, FaBook, FaTrash } from "react-icons/fa";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [customBooksCount, setCustomBooksCount] = useState(0);
  const [hostedBooksCount, setHostedBooksCount] = useState(0);
  const [createdHostedBooksCount, setCreatedHostedBooksCount] = useState(0);

  const navigate = useNavigate();

  const bucketid = import.meta.env.VITE_BUCKET_IMAGE_ID;
  const databaseid = import.meta.env.VITE_DATABASE;
  const usercollectionid = import.meta.env.VITE_COLLECTION_ID_USER;
  const projectid = import.meta.env.VITE_PROJECT_ID;

  const fetchUserDetails = async () => {
    try {
      const userDetails = await account.get();
      setUser(userDetails);
      setName(userDetails.name);
      const userDoc = await databases.getDocument(
        databaseid,
        usercollectionid,
        userDetails.$id
      );

      setDescription(userDoc.User_desc);
      setStatus(userDoc.User_Status);
      setProfilePhoto(userDoc.userprofilephoto || "");

      setCustomBooksCount(userDoc.custombooks?.length || 0);
      setHostedBooksCount(userDoc.hostedbooks?.length || 0);
      setCreatedHostedBooksCount(userDoc.createdhostedbooks?.length || 0);
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
    }
  };

  // Call fetchUserDetails inside useEffect
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    try {
      await account.updateName(name);
      await databases.updateDocument(databaseid, usercollectionid, user.$id, {
        User_desc: description,
        User_name: name,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);

      // Refetch updated user details
      fetchUserDetails();
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected. Please choose a file.");
      return;
    }

    try {
      const uploadResponse = await storage.createFile(
        bucketid,
        ID.unique(),
        file
      );

      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketid}/files/${uploadResponse.$id}/view?project=${projectid}&mode=admin`;

      await databases.updateDocument(databaseid, usercollectionid, user.$id, {
        userprofilephoto: fileUrl,
      });

      setProfilePhoto(fileUrl);
      alert("Profile photo uploaded successfully!");
    } catch (error) {
      alert("Failed to upload profile photo: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      // Delete user record from the database
      await databases.deleteDocument(databaseid, usercollectionid, user.$id);

      // Delete user from Appwrite authentication

      alert("Your account has been deleted.");
      navigate("/"); // Redirect to the homepage after deletion
    } catch (error) {
      alert("Failed to delete account: " + error.message);
    }
  };

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E1CDBB]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <img
              src={
                profilePhoto ||
                "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover shadow-md"
            />
            {isEditing && (
              <label
                htmlFor="upload-photo"
                className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-3 cursor-pointer shadow-lg"
              >
                <FaCamera />
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
                  className="border-b border-gray-300 focus:outline-none"
                />
              ) : (
                user.name
              )}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-700 mt-2">Status: {status}</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-semibold text-gray-700">
            Description
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <p className="text-gray-700 mt-2">{description}</p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <Link
            to="/saved"
            className="bg-button p-6 rounded-lg shadow-md text-center"
          >
            <FaBook className="text-white text-4xl mx-auto" />
            <p className="text-lg font-semibold mt-2 text-white">Saved Books</p>
            <p className="text-2xl font-bold text-white">
              {customBooksCount + hostedBooksCount}
            </p>
          </Link>
          <Link
            to="/userbooks"
            className="bg-button p-6 rounded-lg shadow-md text-center"
          >
            <FaBook className="text-white text-4xl mx-auto" />
            <p className="text-lg font-semibold mt-2 text-white">Your Books</p>
            <p className="text-2xl font-bold text-white">
              {createdHostedBooksCount}
            </p>
          </Link>
        </div>

        <div className="mt-6 flex justify-end">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-button text-white px-6 py-2 rounded-lg flex items-center shadow-md transition"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-300 px-6 py-2 rounded-lg flex items-center shadow-md hover:bg-gray-400 transition"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
