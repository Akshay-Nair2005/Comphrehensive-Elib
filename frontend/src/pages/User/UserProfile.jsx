import React, { useEffect, useState } from "react";
import { account, storage, databases } from "../../appwritee/appwrite";
import { FaCamera, FaSave, FaEdit, FaBook, FaFeatherAlt, FaPenNib, FaBookOpen, FaUserEdit } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import { ID } from "appwrite";
import { useNavigate, Link } from "react-router-dom";

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
      const userDoc = await databases.getDocument(databaseid, usercollectionid, userDetails.$id);

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
      const uploadResponse = await storage.createFile(bucketid, ID.unique(), file);
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
      await databases.deleteDocument(databaseid, usercollectionid, user.$id);
      alert("Your account has been deleted.");
      navigate("/");
    } catch (error) {
      alert("Failed to delete account: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <IoBookOutline className="text-6xl text-[#5E3023] animate-pulse mx-auto" />
            <div className="absolute -top-1 -right-1">
              <FaFeatherAlt className="text-xl text-[#5E3023]/60 animate-bounce" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-serif text-lg italic">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 py-8 px-6">
        <div className="absolute top-4 left-10 opacity-10">
          <FaFeatherAlt className="text-5xl text-[#5E3023] transform -rotate-45" />
        </div>
        <div className="absolute bottom-4 right-10 opacity-10">
          <FaPenNib className="text-4xl text-[#5E3023]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
            <FaUserEdit className="text-2xl text-[#5E3023]" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
            Author Profile
          </h1>
          <p className="text-gray-500 mt-1 italic text-sm">Your literary identity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Profile Header with Cover */}
            <div className="h-32 bg-gradient-to-r from-[#5E3023] via-[#7a3f2e] to-[#5E3023] relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-8">
                  <FaFeatherAlt className="text-4xl text-white transform -rotate-45" />
                </div>
                <div className="absolute bottom-4 right-8">
                  <HiOutlineBookOpen className="text-5xl text-white" />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <div className="relative inline-block">
                  <img
                    src={profilePhoto || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {isEditing && (
                    <label
                      htmlFor="upload-photo"
                      className="absolute bottom-2 right-2 bg-[#5E3023] text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-[#4a261c] transition-colors"
                    >
                      <FaCamera className="text-sm" />
                      <input
                        type="file"
                        id="upload-photo"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-serif font-bold text-gray-800 border-b-2 border-[#5E3023]/30 focus:border-[#5E3023] focus:outline-none bg-transparent w-full max-w-xs"
                    />
                  ) : (
                    <h2 className="text-2xl font-serif font-bold text-gray-800">{user.name}</h2>
                  )}
                  <p className="text-gray-500 mt-1">{user.email}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-[#5E3023]/10 to-[#5E3023]/5 text-[#5E3023] rounded-full text-sm font-medium flex items-center gap-2">
                    <FaPenNib className="text-xs" />
                    {status || "Reader"}
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <FaFeatherAlt className="text-[#5E3023]/60 text-xs" />
                    About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full border-2 border-[#5E3023]/20 p-4 rounded-xl focus:outline-none focus:border-[#5E3023] transition-colors resize-none bg-gray-50"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">
                      {description || "No description yet. Click edit to add one!"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Link
              to="/saved"
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5E3023] to-[#7a3f2e] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Saved Books</p>
                  <p className="text-3xl font-serif font-bold text-gray-800">{customBooksCount + hostedBooksCount}</p>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#5E3023]/20 via-[#5E3023] to-[#5E3023]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </Link>

            <Link
              to="/userbooks"
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5E3023] to-[#7a3f2e] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaPenNib className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Your Novels</p>
                  <p className="text-3xl font-serif font-bold text-gray-800">{createdHostedBooksCount}</p>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#5E3023]/20 via-[#5E3023] to-[#5E3023]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </Link>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-3 bg-gradient-to-r from-[#5E3023] to-[#7a3f2e] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
              >
                <FaSave />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-3 bg-white text-[#5E3023] border-2 border-[#5E3023] px-8 py-3 rounded-full shadow-md hover:bg-[#5E3023] hover:text-white transition-all duration-300 font-medium"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
