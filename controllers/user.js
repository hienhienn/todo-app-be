import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import user from "../models/user.js";

/**
 * @typedef {Object} SignUpType
 * @property {string} first_name - tên người dùng
 * @property {string} last_name - họ người dùng
 * @property {string} email - email người dùng, dùng để đăng nhập
 * @property {string} password - mật khẩu
 * @property {string} confirm_password - dùng để xác nhận mật khẩu, cần giống với trường `password` thì mới tạo được tài khoản
 */

/**
 * @typedef {Object} LogInType
 * @property {string} email - email người dùng
 * @property {string} password - mật khẩu
 */

/**
 * @typedef {Object} UserServiceResponse
 * @property {User} result - thông tin người dùng
 * @property {string} token - json web token, dùng để xác thực người dùng
 */

/** @module controllers/user */

/**
 * @async
 * @function
 * @description Đăng kí tài khoản. Kiểm tra `email` đã được đăng kí hay chưa và kiểm tra trường `confirm_password` và `password` có giống nhau không rồi tạo tài khoản mới. 
 * @param {Object} req - Thông tin front-end gửi cho back-end 
 * @param {SignUpType} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end
 * @param {number} res.statusCode
 * @param {UserServiceResponse | MessageType} res.body
 * Nếu thành công `req` có `status` là 200 và trả về `result` là thông tin người dùng và `token`.
 * Nếu thất bại `req` có `status` là 400 hoặc 500 và `body` chứa thông tin lỗi.
 * @returns {void}
 */
export const signUp = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists.." });

    if (password !== confirm_password)
      return res.status(400).json({ message: "Password should match.." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await user.create({
      email,
      password: hashedPassword,
      name: `${first_name} ${last_name}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "secret", {
      expiresIn: "5h",
    });
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!! try again." });
  }
};

/**
 * @async
 * @function
 * @description Đăng nhập vào tài khoản
 * @param {Object} req - Thông tin front-end gửi cho back-end
 * @param {LogInType} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end
 * @param {number} res.statusCode
 * @param {UserServiceResponse | MessageType} res.body
 * Nếu thành công `req` có `status` là 200 và trả về `result` là thông tin người dùng và `token`.
 * Nếu thất bại `req` có `status` là 400, 404 hoặc 500 và `body` chứa thông tin lỗi.
 * @returns {void}
 */
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist!!" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password,try again!!" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "secret",
      { expiresIn: "5h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong!! please try again" });
  }
};
