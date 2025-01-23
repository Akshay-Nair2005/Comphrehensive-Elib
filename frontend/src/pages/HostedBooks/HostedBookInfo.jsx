import { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { storage } from "../../appwritee/appwrite"; // Import your Appwrite storage client
import { ID } from "appwrite";

const HostedBookInfo = () => {
  const [hbookName, setHbookName] = useState("");
  const [hbookGenre, setHbookGenre] = useState("");
  const [hbookDesc, setHbookDesc] = useState("");
  const [hbookAuthor, setHbookAuthor] = useState("");
  const [hbookAuthDesc, setHbookAuthDesc] = useState("");
  const [hbookNovelImg, setHbookNovelImg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Upload the image to Appwrite and get the URL
  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file selected.");
    }

    try {
      // Ensure file is passed as the first argument
      const response = await storage.createFile(
        "678df3f6000187260af8",
        ID.unique(),
        file
      );

      // Construct the URL for the uploaded file
      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/678df3f6000187260af8/files/${response.$id}/view?project=67458dd70030fdd03393&mode=admin`;

      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!hbookNovelImg) {
      alert("Please upload a cover image.");
      setLoading(false);
      return;
    }

    try {
      // Ensure hbookNovelImg is a valid file object before uploading
      if (hbookNovelImg instanceof File) {
        // Upload the image and get the URL
        const imageUrl = await uploadImage(hbookNovelImg);

        // Submit the form data including the image URL
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
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Hosted book created successfully!");
          console.log("Hosted Book Created:", data);
        } else {
          console.error("Error:", data.error);
        }
      } else {
        throw new Error("The file selected is not valid.");
      }
    } catch (error) {
      console.error("Error creating hosted book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setHbookNovelImg(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Please upload a JPG, PNG, or JPEG image.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-900">
      <div className="flex items-start w-full max-w-5xl gap-6">
        <div
          className={`w-64 h-80 bg-gray-600 ${
            imagePreview ? "" : "animate-pulse"
          } rounded-lg relative`}
        >
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-white mb-6">Story Details</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                placeholder="Untitled Story"
                value={hbookName}
                onChange={(e) => setHbookName(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Choose Cover Image
              </label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div
                onClick={triggerFileInput}
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span>
                  {hbookNovelImg ? hbookNovelImg.name : "No file chosen"}
                </span>
                <FiUpload className="text-white text-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={hbookDesc}
                onChange={(e) => setHbookDesc(e.target.value)}
                rows="4"
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Genre
              </label>
              <input
                type="text"
                placeholder="Select a Category"
                value={hbookGenre}
                onChange={(e) => setHbookGenre(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Author Name
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                value={hbookAuthor}
                onChange={(e) => setHbookAuthor(e.target.value)}
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Author Description
              </label>
              <textarea
                placeholder="Enter author description"
                value={hbookAuthDesc}
                onChange={(e) => setHbookAuthDesc(e.target.value)}
                rows="4"
                className="w-full mt-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostedBookInfo;
