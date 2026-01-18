import { useState, useRef } from "react";
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiBook, FiUser, FiFileText, FiImage, FiTag, FiEdit3 } from "react-icons/fi";
import { FaBookOpen, FaPenNib, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { storage } from "../../appwritee/appwrite";
import { ID } from "appwrite";
import { account } from "../../appwritee/appwrite";
import { useNavigate } from "react-router-dom";

const HostedBookInfo = () => {
  const [hbookName, setHbookName] = useState("");
  const [hbookGenre, setHbookGenre] = useState("");
  const [hbookDesc, setHbookDesc] = useState("");
  const [hbookAuthor, setHbookAuthor] = useState("");
  const [hbookAuthDesc, setHbookAuthDesc] = useState("");
  const [hbookNovelImg, setHbookNovelImg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const bucketid = import.meta.env.VITE_BUCKET_IMAGE_ID;
  const projectid = import.meta.env.VITE_PROJECT_ID;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleClear = () => {
    setHbookName("");
    setHbookGenre("");
    setHbookDesc("");
    setHbookAuthor("");
    setHbookAuthDesc("");
    setHbookNovelImg("");
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    showToast("Form cleared", "info");
  };

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file selected.");
    }

    try {
      const response = await storage.createFile(bucketid, ID.unique(), file);
      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketid}/files/${response.$id}/view?project=${projectid}&mode=admin`;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (
      !hbookNovelImg ||
      !hbookName ||
      !hbookGenre ||
      !hbookDesc ||
      !hbookAuthor ||
      !hbookAuthDesc
    ) {
      showToast("Please fill all required fields", "error");
      setLoading(false);
      return;
    }

    try {
      const user = await account.get();
      if (hbookNovelImg instanceof File) {
        const imageUrl = await uploadImage(hbookNovelImg);

        const response = await fetch("http://localhost:5000/hbooks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hbook_name: hbookName,
            hbook_genre: hbookGenre,
            hbook_desc: hbookDesc,
            hbook_author: hbookAuthor,
            hbook_authdesc: hbookAuthDesc,
            hbook_novelimg: imageUrl,
            userid: user.$id,
          }),
        });

        const data = await response.json();
        console.log(data.$id);
        if (response.ok) {
          showToast("Hosted book created successfully!", "success");
          setTimeout(() => navigate("/userbooks"), 1500);
          console.log("Hosted Book Created:", data);
        } else {
          console.error("Error:", data.error);
          showToast("Failed to create book", "error");
        }
      } else {
        throw new Error("The file selected is not valid.");
      }
      const updateUserCreatedBooksResponse = await fetch(
        `http://localhost:5000/user/${user.$id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdhostedbooks: [data.$id],
          }),
        }
      );
      if (updateUserCreatedBooksResponse.ok) {
        showToast("Chapter saved and linked to the hosted book successfully!", "success");
      } else {
        const errorData = await updateUserCreatedBooksResponse.json();
      }
    } catch (error) {
      console.error("Error creating hosted book:", error);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setHbookNovelImg(file);
        setImagePreview(URL.createObjectURL(file));
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast("Please upload a JPG, PNG, or JPEG image.", "error");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setHbookNovelImg("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    const textFields = [hbookName, hbookGenre, hbookDesc, hbookAuthor, hbookAuthDesc];
    const filledText = textFields.filter(f => f && f.length > 0).length;
    const hasImage = hbookNovelImg ? 1 : 0;
    return Math.round(((filledText + hasImage) / 6) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5ebe0] via-white to-[#f5ebe0] py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-500 animate-slide-in ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : toast.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-xl flex-shrink-0" />
          ) : toast.type === "error" ? (
            <FaTimesCircle className="text-xl flex-shrink-0" />
          ) : (
            <FiAlertCircle className="text-xl flex-shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
            <FaPenNib className="text-3xl text-[#5E3023]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-2">
            Create Your Story
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Share your creativity with the world. Fill in the details below to publish your masterpiece.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Form Completion</span>
            <span className="text-sm font-bold text-[#5E3023]">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5E3023] to-[#7a4030] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Image Preview Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-6">
              <div
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                  dragActive
                    ? "ring-4 ring-[#5E3023] ring-opacity-50 bg-[#5E3023]/10"
                    : "bg-gradient-to-br from-[#E1CDBB] to-[#d4c4b0]"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX className="text-lg" />
                      </button>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-medium truncate">
                          {hbookNovelImg?.name || "Cover Image"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[#5E3023]/5 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center mb-4 shadow-lg">
                      <FiImage className="text-3xl text-[#5E3023]" />
                    </div>
                    <p className="text-[#5E3023] font-semibold text-lg">Upload Cover</p>
                    <p className="text-gray-500 text-sm mt-1">Drag & drop or click</p>
                    <p className="text-gray-400 text-xs mt-2">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#5E3023]/10">
                  <div className="flex items-center gap-2 text-[#5E3023] mb-1">
                    <FiFileText className="text-lg" />
                    <span className="text-xs font-medium uppercase tracking-wide">Description</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{hbookDesc.length}</p>
                  <p className="text-xs text-gray-500">characters</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#5E3023]/10">
                  <div className="flex items-center gap-2 text-[#5E3023] mb-1">
                    <FiCheck className="text-lg" />
                    <span className="text-xs font-medium uppercase tracking-wide">Status</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {progress === 100 ? "Ready!" : "In Progress"}
                  </p>
                  <p className="text-xs text-gray-500">{6 - Math.round(progress / 16.67)} fields left</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-[#5E3023]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#5E3023]/10 flex items-center justify-center">
                  <FaBookOpen className="text-[#5E3023]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Story Details</h2>
                  <p className="text-sm text-gray-500">Tell us about your book</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiBook className="text-[#5E3023]" />
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your story title..."
                    value={hbookName}
                    onChange={(e) => setHbookName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400"
                  />
                </div>

                {/* Cover Image (Hidden but functional) */}
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                {/* Cover Image Button */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiImage className="text-[#5E3023]" />
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={triggerFileInput}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-between ${
                      hbookNovelImg
                        ? "border-green-400 bg-green-50"
                        : "border-[#5E3023]/20 hover:border-[#5E3023] bg-white/50"
                    }`}
                  >
                    <span className={`truncate ${hbookNovelImg ? "text-green-700" : "text-gray-400"}`}>
                      {hbookNovelImg ? hbookNovelImg.name : "Click to upload cover image..."}
                    </span>
                    {hbookNovelImg ? (
                      <FiCheck className="text-green-500 text-xl flex-shrink-0" />
                    ) : (
                      <FiUpload className="text-[#5E3023] text-xl flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiFileText className="text-[#5E3023]" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Write a compelling description of your story..."
                    value={hbookDesc}
                    onChange={(e) => setHbookDesc(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right">{hbookDesc.length} characters</p>
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiTag className="text-[#5E3023]" />
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={hbookGenre}
                    onChange={(e) => setHbookGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 cursor-pointer"
                  >
                    <option value="" disabled>Select a genre...</option>
                    <option value="Anime">🎌 Anime</option>
                    <option value="Non-Fiction">📚 Non-Fiction</option>
                    <option value="Fantasy">🧙 Fantasy</option>
                    <option value="Sci-Fi">🚀 Sci-Fi</option>
                    <option value="Thriller">😱 Thriller</option>
                    <option value="Mystery">🔍 Mystery</option>
                    <option value="Romance">💕 Romance</option>
                  </select>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5E3023]/20 to-transparent"></div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Author Info</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5E3023]/20 to-transparent"></div>
                </div>

                {/* Author Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiUser className="text-[#5E3023]" />
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your pen name..."
                    value={hbookAuthor}
                    onChange={(e) => setHbookAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400"
                  />
                </div>

                {/* Author Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiEdit3 className="text-[#5E3023]" />
                    Author Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Tell readers about yourself..."
                    value={hbookAuthDesc}
                    onChange={(e) => setHbookAuthDesc(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3">
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiX className="text-lg" />
                  Clear Form
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || progress < 100}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    progress === 100
                      ? "bg-gradient-to-r from-[#5E3023] to-[#7a4030] text-white hover:shadow-xl hover:from-[#4a261c] hover:to-[#5E3023]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <HiSparkles className="text-lg" />
                      <span>Publish Story</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HostedBookInfo;
