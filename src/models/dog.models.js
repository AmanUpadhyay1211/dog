import { Schema, model } from "mongoose";

const dogSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        color: {
            type: String, // Optional field, not marked as required
        },
        sterilizationCard: {
            type: String,
            enum: ['Yes', 'No', 'Book an appointment'],
            required: true,
        },
        vaccinationCard: {
            type: String,
            enum: ['Yes', 'No', 'Book an appointment'],
            required: true,
        },
        owner: {
            type: String,
            required: true,
        },
        dogImages: {
            type: [String], // Array of image URLs (strings) by default
            default: [], 
        },
    },
    {
        timestamps: true, 
    }
);

export const Dog = model("Dog", dogSchema);
