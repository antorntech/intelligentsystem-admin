import {
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import moment from "moment";

const AddService = () => {
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
  const [benefits, setBenefits] = useState([]);
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [courseOffers, setCourseOffers] = useState([]);
  const [currentCourseOffers, setCurrentCourseOffers] = useState("");
  const [works, setWorks] = useState([]);
  const [currentWorks, setCurrentWorks] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState("Skill Development Training");
  const date = moment().format("Do MMMM, YYYY");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

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

  const handleBenefitsChange = (e) => {
    setCurrentBenefit(e.target.value);
  };

  const handleBenefitsKeyDown = (e) => {
    if (e.key === "Enter" && currentBenefit.trim() !== "") {
      e.preventDefault();
      if (!benefits.includes(currentBenefit.trim())) {
        // Check for duplicates
        setBenefits([...benefits, currentBenefit.trim()]);
      }
      setCurrentBenefit(""); // Clear the input field
    }
  };

  const removeBenefit = (indexToRemove) => {
    setBenefits(benefits.filter((_, index) => index !== indexToRemove));
  };

  const handleCourseOffersChange = (e) => {
    setCurrentCourseOffers(e.target.value);
  };

  const handleCourseOffersKeyDown = (e) => {
    if (e.key === "Enter" && currentCourseOffers.trim() !== "") {
      e.preventDefault();
      if (!courseOffers.includes(currentCourseOffers.trim())) {
        // Check for duplicates
        setCourseOffers([...courseOffers, currentCourseOffers.trim()]);
      }
      setCurrentCourseOffers(""); // Clear the input field
    }
  };

  const removeCourseOffer = (indexToRemove) => {
    setCourseOffers(courseOffers.filter((_, index) => index !== indexToRemove));
  };

  const moveCourseOfferUp = (index) => {
    if (index > 0) {
      const newCourseOffers = [...courseOffers];
      [newCourseOffers[index - 1], newCourseOffers[index]] = [
        newCourseOffers[index],
        newCourseOffers[index - 1],
      ];
      setCourseOffers(newCourseOffers);
    }
  };

  const moveCourseOfferDown = (index) => {
    if (index < courseOffers.length - 1) {
      const newCourseOffers = [...courseOffers];
      [newCourseOffers[index + 1], newCourseOffers[index]] = [
        newCourseOffers[index],
        newCourseOffers[index + 1],
      ];
      setCourseOffers(newCourseOffers);
    }
  };

  const handleWorksChange = (e) => {
    setCurrentWorks(e.target.value);
  };

  const handleWorksKeyDown = (e) => {
    if (e.key === "Enter" && currentWorks.trim() !== "") {
      e.preventDefault();
      if (!works.includes(currentWorks.trim())) {
        // Check for duplicates
        setWorks([...works, currentWorks.trim()]);
      }
      setCurrentWorks(""); // Clear the input field
    }
  };

  const removeWork = (indexToRemove) => {
    setWorks(works.filter((_, index) => index !== indexToRemove));
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

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("title", title);
    formData.append("details", details);
    formData.append("benefits", JSON.stringify(benefits));
    formData.append("courseOffers", JSON.stringify(courseOffers));
    formData.append("works", JSON.stringify(works));
    formData.append("tags", JSON.stringify(tags));
    formData.append("category", category);
    formData.append("author", "Admin");
    formData.append("date", date);

    console.log(title, details, blockQuote, tags, category);

    try {
      // Retrieve existing data from local storage
      const existingData =
        JSON.parse(localStorage.getItem("servicesData")) || [];

      // Create new entry object
      const newEntry = {
        id: Date.now(), // Unique ID for the new entry
        title,
        details,
        benefits,
        courseOffers,
        works,
        tags,
        category,
        date: date,
        author: "Admin",
        banner: imagePreview, // Assuming imagePreview holds the URL or base64 of the image
      };

      // Add the new entry to the existing data
      const updatedData = [...existingData, newEntry];

      // Save the updated data back to local storage
      localStorage.setItem("servicesData", JSON.stringify(updatedData));

      // Show success toast
      toast.success("Upload successful", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Navigate to the services page
      navigate("/services");

      // Reset the form
      setImage(null);
      setImagePreview(null);
      setTitle("");
      setDetails("");
      setBenefits([]);
      setCourseOffers([]);
      setWorks([]);
      setTags([]);
      setCategory("Skill Development Training");
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form in case of error
      setImage(null);
      setImagePreview(null);
      setTitle("");
      setDetails("");
      setBenefits([]);
      setCourseOffers([]);
      setWorks([]);
      setTags([]);
      setCategory("Skill Development Training");
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
        <h1 className="text-xl font-bold">Add Service</h1>
        <p className="text-sm text-gray-500">
          You can add service details from here.
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
          {/* <div>
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
          </div> */}
          {/* Benefits input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Benefits
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter benefits and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentBenefit}
              name="benefits"
              onChange={handleBenefitsChange}
              onKeyDown={handleBenefitsKeyDown} // Handle Enter key
            />
            {/* Display benefits */}
            <div className="mt-2 flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                >
                  <div>
                    <i class="fa-solid fa-check mr-2"></i>
                    {benefit}
                  </div>
                  <button
                    onClick={() => removeBenefit(index)}
                    className="ml-2 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Course Offers input field */}
            <div>
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Course Offers
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="Enter course offers and press Enter"
                className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={currentCourseOffers}
                name="courseOffers"
                onChange={handleCourseOffersChange}
                onKeyDown={handleCourseOffersKeyDown} // Handle Enter key
              />
              {/* Display course offers */}
              <div className="mt-2 flex flex-wrap gap-2">
                {courseOffers.map((courseOffer, index) => (
                  <div
                    key={index}
                    className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                  >
                    <div>
                      <i className="fa-solid fa-check mr-2"></i>
                      {courseOffer}
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => moveCourseOfferUp(index)}
                        className="text-gray-700 bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center mr-2"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveCourseOfferDown(index)}
                        className="text-gray-700 bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center mr-2"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeCourseOffer(index)}
                        className="text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Work Plan input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              How It Works
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter how it works and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentWorks}
              name="works"
              onChange={handleWorksChange}
              onKeyDown={handleWorksKeyDown} // Handle Enter key
            />
            {/* Display course offers */}
            <div className="mt-2 flex flex-wrap gap-2">
              {works.map((work, index) => (
                <div
                  key={index}
                  className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                >
                  <div>
                    <i class="fa-solid fa-check mr-2"></i>
                    {work}
                  </div>
                  <button
                    onClick={() => removeWork(index)}
                    className="ml-2 text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
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
            onClick={handleUpload}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Upload
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

export default AddService;
