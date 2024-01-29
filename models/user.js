import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {String} id
 * @property {String} name - tên người dùng
 * @property {String} email - email dùng để đăng nhập
 * @property {String} password - mật khẩu tài khoản
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
