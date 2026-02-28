import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    userId: { type: String, requried: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    code: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Snippet ||
  mongoose.model("Snippet", SnippetSchema);
