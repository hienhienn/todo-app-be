import mongoose from "mongoose";

/**
 * @typedef {Object} Notes
 * @property {String} title tiêu đề của ghi chú
 * @property {String} description nội dung
 * @property {Date} date thời gian tới hạn của ghi chú
 * @property {String} creator người tạo
 * @property {Date} [createdAt = new Date()] thời gian tạo
 * @property {boolean} [done = false] `true` nếu đã hoàn thành, `false` nếu chưa hoàn thành,
 */

const noteSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    creator: { type: String, required: true },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    done: { type: Boolean, default: false },
  },
  {
    collection: "note",
  }
);

export default mongoose.model("Notes", noteSchema);
