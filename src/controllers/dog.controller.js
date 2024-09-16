import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Dog } from "../models/dog.models.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js";


const registerDog = asyncHandler(async (req, res) => {
  const { name, gender, age, color, sterilizationCard, vaccinationCard, owner } = req.body;

  // Check for missing fields
  if (
    [name, gender, age, sterilizationCard, vaccinationCard, owner].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Invalid request: Missing required field(s)");
  }

  let dogImagesArray = [];

  // Check if files exist and process the uploads
  if (req.files && Array.isArray(req.files)) {
    for (let imageFile of req.files) {
      console.log('Uploading image:', imageFile);
      try {
        const uploadResult = await uploadOnCloudinary(imageFile.path); // Upload each image to Cloudinary
        console.log('Upload result:', uploadResult);
        dogImagesArray.push(uploadResult.secure_url); // Store the secure_url returned from Cloudinary
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new ApiError(500, "Error uploading image to Cloudinary.");
      }
    }
  }

  try {
    const dogCreated = await Dog.create({
      name,
      gender,
      age,
      color: color || "colorfull",
      sterilizationCard,
      vaccinationCard,
      owner,
      dogImages: dogImagesArray,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, dogCreated, "Dog created successfully"));

  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (e.g. if dog name must be unique)
      throw new ApiError(409, "Duplicate entry: This dog already exists.");
    }
    // Any other errors
    throw new ApiError(500, "Internal server error: Failed to create dog in DB");
  }
});

const getDogById = asyncHandler(async (req, res) => {
  const { dogId } = req.params;

  if (!dogId) throw new ApiError(400, "Bad request: Dog ID is required.");

  const dogInDB = await Dog.findById(dogId);
  if (!dogInDB) throw new ApiError(404, "Dog not found: No such dog exists with the provided ID.");

  res.status(200).json(new ApiResponse(200, dogInDB, "Dog fetched successfully"));
});

// Get all dogs with pagination and optional query filters
const getAllDogInDb = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page

  const query = {}; //Yaha pe aur filter daal sakte hai jaise iss particular owner ke kutte

  const dogs = await Dog.find(query)
    .limit(parseInt(limit))
    .skip((page - 1) * limit);

  const totalDogs = await Dog.countDocuments(query); // Get total number of dogs

  res.status(200).json({
    status: 200,
    message: "Dogs fetched successfully",
    data: {
      dogs,
      pagination: {
        total: totalDogs,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    },
  });
});

export { registerDog, getDogById, getAllDogInDb };
