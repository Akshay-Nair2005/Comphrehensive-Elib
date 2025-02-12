import { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { storage } from "../../appwritee/appwrite"; // Import your Appwrite storage client
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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const bucketid = import.meta.env.VITE_BUCKET_IMAGE_ID;
  const projectid = import.meta.env.VITE_PROJECT_ID;

  // Upload the image to Appwrite and get the URL
  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file selected.");
    }

    try {
      // Ensure file is passed as the first argument
      const response = await storage.createFile(bucketid, ID.unique(), file);

      // Construct the URL for the uploaded file
      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketid}/files/${response.$id}/view?project=${projectid}&mode=admin`;

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
      const user = await account.get();
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
            userid: user.$id,
          }),
        });

        const data = await response.json();
        console.log(data.$id);
        if (response.ok) {
          alert("Hosted book created successfully!");
          navigate("/userbooks");
          console.log("Hosted Book Created:", data);
        } else {
          console.error("Error:", data.error);
        }
      } else {
        throw new Error("The file selected is not valid.");
      }
      //pathwork
      const updateUserCreatedBooksResponse = await fetch(
        `http://localhost:5000/user/${user.$id}`,
        {
          method: "PATCH", // Assuming PATCH is used to update a document
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdhostedbooks: [data.$id],
          }),
        }
      );
      if (updateUserCreatedBooksResponse.ok) {
        alert("Chapter saved and linked to the hosted book successfully!");
      } else {
        const errorData = await updateUserCreatedBooksResponse.json();
        // alert(`Failed to update hosted book: ${errorData.error}`);
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
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="flex items-start w-full max-w-5xl gap-6">
        <div
          className={`w-64 h-80 bg-hover ${
            imagePreview ? "" : ""
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
        <div className="flex-1 bg-hover p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-white mb-6">Story Details</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Title
              </label>
              <input
                type="text"
                placeholder="Untitled Story"
                value={hbookName}
                onChange={(e) => setHbookName(e.target.value)}
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
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
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              >
                <span>
                  {hbookNovelImg ? hbookNovelImg.name : "No file chosen"}
                </span>
                <FiUpload className="text-[#5E3023] text-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={hbookDesc}
                onChange={(e) => setHbookDesc(e.target.value)}
                rows="4"
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Genre
              </label>
              <select
                value={hbookGenre}
                onChange={(e) => setHbookGenre(e.target.value)}
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              >
                <option value="" disabled>
                  Select a Genre
                </option>
                <option value="Anime">Anime</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Thriller">Thriller</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Author Name
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                value={hbookAuthor}
                onChange={(e) => setHbookAuthor(e.target.value)}
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Author Description
              </label>
              <textarea
                placeholder="Enter author description"
                value={hbookAuthDesc}
                onChange={(e) => setHbookAuthDesc(e.target.value)}
                rows="4"
                className="w-full mt-1 p-3 bg-white text-black border border-[#5E3023] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1CDBB]"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button className="px-6 py-2 bg-beige text-black rounded-lg font-medium hover:bg-red-500 transition">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-button hover:bg-[#49251b] text-white rounded-lg font-medium  transition"
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
