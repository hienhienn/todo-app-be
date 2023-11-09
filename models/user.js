import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {String} id
 * @property {String} name - tên người dùng
 * @property {String} email - email dùng để đăng nhập
 * @property {String} password - mật khẩu tài khoản
 */

/**
 * Lược đồ thể hiện cấu trúc của người sử dụng, được lưu vào Collection `User` trong MongoDB:
 *
 * `id: String` - id
 *
 * `name: String` - tên, bắt buộc có
 *
 * `email: String` - email, bắt buộc có
 *
 * `password: String` - mật khẩu, bắt buộc có
 */
const userSchema = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    collection: "user",
  }
);

export default mongoose.model("User", userSchema);
