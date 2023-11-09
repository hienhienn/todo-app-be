import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import user from "../models/user.js";

/**
 * Đăng kí tài khoản
 * @param {Object} req - Thông tin front-end gửi cho back-end 
 * @param {{
 *  first_name: string;
 *  last_name: string;
 *  email: string;
 *  password: string;
 *  confirm_password: string;
 * }} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end
 * @param {number} res.statusCode
 * @param {{
 *  result: User;
 *  token: string;
 * } | {
 *  message: string
 * }} res.body
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
 * Đăng nhập vào tài khoản
 * @param {Object} req - Thông tin front-end gửi cho back-end
 * @param {{
 * email: string;
 * password: string;
 * }} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end
 * @param {number} res.statusCode
 * @param {{
 *  result: User;
 *  token: string;
 * } | {
 *  message: string;
 * }} res.body
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
