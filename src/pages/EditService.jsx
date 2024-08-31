import { Input, Textarea, Typography, Select } from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import moment from "moment";

const EditService = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const navigate = useNavigate();
  const config = {
    readonly: false,
    height: 300,
    placeholder: "Write your service block quote...",
  };
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/530x480"
  );
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const editor = useRef(null);
  const [blockQuote, setBlockQuote] = useState("");
  const [tags, setTags] = useState([]); // Tags as an array
  const [currentTag, setCurrentTag] = useState(""); // To handle the input value for the tag
  const [category, setCategory] = useState("Skill Development Training"); // Default category
  const date = moment().format("Do MMMM, YYYY");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedServices =
      JSON.parse(localStorage.getItem("servicesData")) || [];
    const serviceToEdit = storedServices.find(
      (service) => service.id === parseInt(id)
    );

    if (serviceToEdit) {
      setTitle(serviceToEdit.title);
      setDetails(serviceToEdit.details);
      setBlockQuote(serviceToEdit.blockQuote);
      setTags(serviceToEdit.tags);
      setCategory(serviceToEdit.category);
      setImagePreview(serviceToEdit.banner);
    } else {
      toast.error("Service not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/services");
    }
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 50MB limit.");
      setFileKey(Date.now());
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleBlockQuoteChange = (e) => {
    setBlockQuote(e.target.value);
  };

  const handleTagsChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleTagsKeyDown = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        // Check for duplicates
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag(""); // Clear the input field
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("title", title);
    formData.append("details", details);
    formData.append("blockQuote", blockQuote);
    formData.append("tags", JSON.stringify(tags)); // Include tags array in the form data
    formData.append("category", category);
    formData.append("author", "Admin");
    formData.append("date", date);

    try {
      const storedServices =
        JSON.parse(localStorage.getItem("servicesData")) || [];
      const updatedServices = storedServices.map((service) =>
        service.id === parseInt(id)
          ? {
              ...service,
              title,
              details,
              blockQuote,
              tags,
              category,
              date,
              banner: image ? URL.createObjectURL(image) : imagePreview,
            }
          : service
      );

      localStorage.setItem("servicesData", JSON.stringify(updatedServices));

      toast.success("Service updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/services");

      setImage(null);
      setImagePreview(null);
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error updating review", error);
      setImage(null);
      setImagePreview(null);
      setFileKey(Date.now());
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/530x480");
    setFileKey(Date.now());
    setUploadProgress(0);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Edit Service</h1>
        <p className="text-sm text-gray-500">
          You can edit the service details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Title
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter service title"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={title}
              name="title"
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Details
            </Typography>
            <Textarea
              value={details}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleDetailsChange}
              rows={5}
              placeholder="Enter service details"
            />
          </div>
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Block Quote
            </Typography>
            <JoditEditor
              ref={editor}
              value={blockQuote}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setBlockQuote(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => {}}
            />
          </div>
          {/* Tags input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Tags
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter tags and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentTag}
              name="tags"
              onChange={handleTagsChange}
              onKeyDown={handleTagsKeyDown} // Handle Enter key
            />
            {/* Display tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="ml-2 text-white bg-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full md:w-[55%]">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Category
              </Typography>
              <Select
                className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={category}
                onChange={handleCategoryChange}
                size="lg"
              >
                <Option value="Skill Development Training">
                  Skill Development Training
                </Option>
                <Option value="Internet of Things">Internet of Things</Option>
                <Option value="Artificial Intelligence">
                  Artificial Intelligence
                </Option>
                <Option value="Research & Development">
                  Research & Development
                </Option>
                <Option value="Blockchain Application">
                  Blockchain Application
                </Option>
                <Option value="Software Development">
                  Software Development
                </Option>
              </Select>
            </div>
            <div className="w-full md:w-[45%]">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Banner
              </Typography>
              <input
                key={fileKey}
                type="file"
                onChange={handleImageChange}
                className=""
              />
              {uploadProgress > 0 && (
                <div className="mt-3">
                  <progress value={uploadProgress} max="100">
                    {uploadProgress}%
                  </progress>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
        {imagePreview && (
          <div className="relative w-full md:w-1/2 h-[500px] mt-5 md:mt-0 md:ml-5 border-[1px] border-gray-400 rounded-md">
            <button
              className="bg-red-800 text-white w-8 h-8 rounded-full absolute top-2 right-2 flex items-center justify-center"
              onClick={clearPreview}
            >
              <i className="fa-solid fa-xmark text-white"></i>
            </button>
            <img
              src={imagePreview ? imagePreview : "https://placehold.co/530x480"}
              alt="Selected"
              className="max-w-full h-full md:w-full object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditService;
