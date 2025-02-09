import notes from "../models/note.js";
import mongoose from "mongoose";
import {
  getNotification,
  inAppNotification,
  smsNotification,
} from "../novu/novu.js";

/** 
 * @typedef {Object} MessageType
 * @property {string} message - thông báo kết quả của request
 */

/**
 * @typedef {Object} CreateNoteType
 * @property {String} title - tiêu đề của ghi chú
 * @property {String} description - nội dung ghi chú
 * @property {Date | null} date - ngày tới hạn của ghi chú
 * @property {String} message - nội dung thông báo inapp khi tạo ghi chú mới
 */

/**
 * @typedef {Object} SendSmsType
 * @property {String} title - tiêu đề của ghi chú
 * @property {String} description - nội dung ghi chú
 * @property {string} phone - số điện thoại nhận thông báo
 * @property {string} noteId - id của ghi chú
 */

/**
 * @typedef {Object} SendEmailType
 * @property {String} title - tiêu đề của ghi chú
 * @property {String} description - nội dung ghi chú
 * @property {string} email - email nhận thông báo
 * @property {string} noteId - id của ghi chú
 */

/**
 * @typedef {Object} DeleteInappType
 * @property {String} title - tiêu đề của ghi chú
 * @property {String} description - nội dung ghi chú
 * @property {string} userId - id của người dùng
 * @property {string} message - nội dung thông báo inapp
 */

/** @module controllers/note */

/**
 * @description Lấy thông tin của tất cả các ghi chú từ database và trả về cho front-end
 * @async
 * @function
 * @param {Object} req - Thông tin từ front-end gửi cho back-end
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {Array<Notes> | MessageType} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` là thông tin của các ghi chú.
 * Nếu xảy ra lỗi, `res` có `status` là 409 và `body` là thông tin lỗi.
 * @returns {void}
 */
export const getNotes = async (req, res) => {
  try {
		const allNotes = await notes.find();
		res.status(200).json(allNotes);
	} catch (error) {
		res.status(409).json({ message: error });
	}
  console.log(res)
};

/**
 * @description Tạo ghi chú mới và lưu vào database và nhận thông báo in app về ghi chú đó
 * @async
 * @function
 * @param {Object} req - Thông tin từ front-end gửi về cho back-end
 * @param {CreateNoteType} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {Notes | MessageType} res.body
 * Nếu thành công, `res` có `status` là 201 và `body` là thông tin của ghi chú vừa được tạo.
 * Nếu xảy ra lỗi, `res` có `status` là 409 và `body` là thông tin lỗi.
 * @returns {void}
 */
export const createNote = async (req, res) => {
  const { title, description, date, message } = req.body;
  /**
   * @type {Notes} ghi chú mới được tạo
   */
  const newNote = new notes({
    title,
    description,
    date,
    creator: req.userId,
    createdAt: new Date().toISOString(),
    checked: false,
  });
  try {
    await newNote.save();
    await inAppNotification(title, description, req.userId, message);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

/**
 * @description Xoá một ghi chú khỏi database bằng id được gửi tới.
 * @async
 * @function
 * @param {Object} req - Thông tin từ front-end gửi về cho back-end
 * @param {Object} req.param
 * @param {string} req.params.id - id của ghi chú
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {string | MessageType} res.body
 * Nếu thành công, `res` có `body` thông báo ghi chú được xoá thành công.
 * Nếu xảy ra lỗi, `res` có `status` là 404 và `body` thông báo không tìm thấy ghi chú với id đã request.
 * @returns {void}
 */
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`no note is available with id:${id}`);
  await notes.findByIdAndRemove(id);
  res.json({ message: "Note deleted successfully" });
};

/**
 * @description Cập nhật một ghi chú
 * @async
 * @function
 * @param {Object} req - Thông tin từ front-end gửi về cho back-end
 * @param {Object} req.param
 * @param {string} req.params.id - id của ghi chú
 * @param {Notes} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {Notes | string} res.body
 * Nếu thành công, `res` có `body` là thông tin của ghi chú vừa được cập nhật.
 * Nếu xảy ra lỗi, `res` có `status` là 404 và `body` thông báo không tìm thấy ghi chú với id đã request.
 * @returns {void}
 */
export const updateNote = async (req, res) => {
  const { id: _id } = req.params;
  const note = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No note is available with id:${id}`);
  const updatedNote = await notes.findByIdAndUpdate(
    _id,
    { ...note, _id },
    { new: true }
  );
  res.json(updatedNote);
};

/**
 * @description Gửi tin nhắn sms
 * @async
 * @function
 * @param {Object} req - Thông tin từ front-end gửi cho back-end về nội dung tin nhắn cần gửi và ghi chú nào
 * @param {SendSmsType} req.body
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {MessageType} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` thông báo gửi tin nhắn thành công.
 * Nếu xảy ra lỗi, `res` có `status` là 500 và `body` thông báo gửi tin nhắn thất bại.
 * @returns {void}
 */
export const sendSmsNotification = async (req, res) => {
  try {
    const { title, description, phone, noteId } = req.body;
    await smsNotification(title, description, phone, noteId);
    res.status(200).json({ message: "SMS sent successfully" });
  } catch (error) {
    console.log("sendSmsNotification error", error);
    res.status(500).json({ message: "Failed to send SMS" });
  }
};

/**
 * @async
 * @function
 * @description Gửi email
 * @param {Object} req - Thông tin từ front-end gửi cho back-end về nội dung email cần gửi và ghi chú nào
 * @param {SendEmailType} req.body - Thông tin từ front-end gửi cho back-end về nội dung email cần gửi và ghi chú nào
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {MessageType} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` thông báo gửi email thành công.
 * Nếu xảy ra lỗi, `res` có `status` là 500 và `body` thông báo gửi email thất bại.
 * @returns {void}
 */
export const sendEmailNotification = async (req, res) => {
  try {
    const { title, description, email, noteId } = req.body;
    await getNotification(title, description, email, noteId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log("sendEmailNotification error", error);
    res.status(500).json({ message: "Failed to send Email" });
  }
};

/**
 * @async
 * @function
 * @description Gửi thông báo in-app về việc xoá ghi chú
 * @param {Object} req - Thông tin từ front-end gửi cho back-end
 * @param {DeleteInappType} req.body - Thông tin từ front-end gửi cho back-end
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {MessageType} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` thông báo thành công.
 * Nếu xảy ra lỗi, `res` có `status` là 500 và `body` thông báo thất bại.
 * @returns {void}
 */
export const deleteInAppNotification = async (req, res) => {
  try {
    const { title, description, userId, message } = req.body;
    await inAppNotification(title, description, userId, message);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log("deleteInAppNotification error", error);
    res.status(500).json({ message: "Failed to delete Todo" });
  }
};

/**
 * @async
 * @function
 * @description Đánh dấu ghi chú đã hoàn thành/chưa hoàn thành
 * @param {Object} req - Thông tin từ front-end gửi cho back-end
 * @param {string} req.param.id
 * @param {Object} res - Thông tin back-end trả về cho front-end.
 * @param {number} res.statusCode
 * @param {Notes | string} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` thông tin ghi chú vừa được thay đổi.
 * Nếu xảy ra lỗi, `res` có `status` là 500 và `body` thông báo lỗi thất bại.
 * @returns {void}
 */
export const toggleNoteDone = async (req, res) => {
  try {
    const noteRef = await notes.findById(req.params.id);

    const note = await notes.findOneAndUpdate(
      { _id: req.params.id },
      { done: !noteRef.done }
    );

    await note.save();

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
