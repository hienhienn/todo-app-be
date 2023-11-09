import mongoose from "mongoose";

/**
 * @typedef {Object} Notes
 * @property {String} title tiêu đề của ghi chú
 * @property {String} description nội dung
 * @property {Date} date thời gian tới hạn của ghi chú
 * @property {String} creator người tạo
 * @property {Date} [createdAt = new Date()] thời gian tạo
 * @@property {boolean} [done = false] `true` nếu đã hoàn thành, `false` nếu chưa hoàn thành,
 */


/**
 * Lược đồ thể hiện cấu trúc của ghi chú, được lưu vào Collection `Note` trong MongoDB:
 *
 * `title: String` - tiêu đề, bắt buộc có
 *
 * `description: String` - mô tả
 *
 * `date: Date` - hạn của ghi chú, bắt buộc có
 *
 * `creator: String` - người tạo, bắt buộc có
 *
 * `createdAt: Date` - ngày tạo, giá trị mặc định là thời gian back-end tạo ghi chú
 *
 * `done: Boolean` - `true` nếu đã hoàn thành, `false` nếu chưa hoàn thành, giá trị mặc định là `false`
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
