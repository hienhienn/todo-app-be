import { Novu } from "@novu/node";
import dotenv from "dotenv";
import CircularJSON from "circular-json";

dotenv.config();

/**
 * Gửi email sử dụng Novu:
 * - Bước 1: Tạo 1 subcriber bằng Id và email truyền vào.
 * - Bước 2: Kích hoạt workflow gửi email với các thông tin cần thiết.
 * @param {string} title - Tiêu đề của email cần gửi
 * @param {string} description - Nội dung của email
 * @param {string} email - Địa chỉ email
 * @param {string} Id - Id để tạo subcribers
 * @returns {void}
 */
export const getNotification = async (title, description, email, Id) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  await novu.subscribers.identify(Id, {
    email: email,
    firstName: "Subscriber",
  });

  await novu.trigger("momentum--L67FbJvt", {
    to: {
      subscriberId: Id,
      email: email,
    },
    payload: {
      title: title,
      description: description,
    },
  });
};

/**
 * Gửi tin nhắn SMS bằng Novu: Kích hoạt workflow gửi tin nhắn với thông tin cần thiết
 * @param {string} title - Tiêu đề tin nhắn cần gửi
 * @param {string} description - Nội dung tin nhắn
 * @param {string} phone - Số điện thoại cần gửi
 * @param {string} Id - Id của subcriber
 * @returns {void}
 */
export const smsNotification = async (
  title,
  description,
  phone,
  Id,
) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  novu.trigger("sms", {
    to: {
      subscriberId: Id,
      phone: `+91${phone}`,
    },
    payload: {
      title: title,
      description: description,
    },
  });
};

/**
 * Nhận thông báo in-app: Kích hoạt workflow gửi thông báo in-app
 * @param {string} title - Tiêu đề thông báo
 * @param {string} description - Nội dung
 * @param {string} Id - Id subcriber
 * @param {string} message - thông báo
 * @returns {void}
 */
export const inAppNotification = async (title, description, Id, message) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  await novu.subscribers.identify(Id, {
    firstName: "inAppSubscriber",
  });

  await novu.trigger("in-app", {
    to: {
      subscriberId: Id,
    },
    payload: {
      title: title,
      description: description,
      message: message,
    },
  });
};

/**
 * Tạo một topic có tên và key xác định
 * 
 * *Topic là một nhóm các subcrbers cùng nhận thông báo về một sự kiện nào đó*
 * @param {Object} req - Thông tin front-end gửi về cho back-end
 * @param {{
 *  key: string;
 *  name: string
 * }} req.body
 * @param {Object} res - Thông tin back-end gửi cho front-end.
 * @param {number} res.statusCode
 * @param {Notes | string} res.body
 * Nếu thành công, `res` có `status` là 200 và `body` chứa thông tin topic vừa được tạo.
 * Nếu thất bại, `res` có `status` là 500 và `body` chứa thông báo lỗi xảy ra.
 */
export const getTopics = async (req, res) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  // key is novu-sumit
  // name is topics-sumit
  const { key, name } = req.body;
  try {
    const result = await novu.topics.create({ key, name });
    res.status(201).json(CircularJSON.stringify({ result }));
  } catch (error) {
    res.status(500).json(CircularJSON.stringify({ message: error.message }));
  }
};

/**
 * Lấy thông tin của 1 topic thông qua key xác định.
 * 
 * *Topic là một nhóm các subcrbers cùng nhận thông báo về một sự kiện nào đó*
 * @param {*} req - Thông tin front-end gửi về cho back-end
 * @param {*} res - Thông tin back-end gửi cho front-end.
 * Nếu thành công, `res` có `status` là 200 và `body` chứa thông tin topic cần tìm.
 * Nếu thất bại, `res` có `status` là 500 và `body` chứa thông báo lỗi xảy ra.
 */
export const getTopicByKey = async (req, res) => {
  const novu = new Novu(process.env.NOVU_API_KEY);
  const { key } = req.params;

  try {
    const result = await novu.topics.get(key);
    res.status(200).json(CircularJSON.stringify(result));
  } catch (error) {
    res.status(500).json(CircularJSON.stringify({ message: error.message }));
  }
};

/**
 * Tạo một subcriber qua email
 * @param {*} req - Thông tin front-end gửi về cho back-end
 * @param {*} res - Thông tin back-end gửi cho front-end.
 * Nếu thành công, `res` có `status` là 200 và `body` chứa id của subcriber vừa được tạo.
 * Nếu thất bại, `res` có `status` là 500 và `body` chứa thông báo lỗi xảy ra.
 */
export const createSubscriber = async (req, res) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  try {
    const email = req.body.email;

    // Call Novu SDK to create the subscriber with email
    const subscriber = await novu.subscribers.identify(email, {
      email: email,
      returnUser: true,
    });

    // Return the subscriber ID in JSON response
    res.status(200).json(subscriber.id);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * Thêm subcriber vào topic sử dụng topicKey và subscriberId
 * @param {*} req - Thông tin front-end gửi về cho back-end
 * @param {*} res - Thông tin back-end gửi cho front-end.
 * Nếu thành công, `res` có `status` là 200 và `body` chứa kết quả.
 * Nếu thất bại, `res` có `status` là 500 và `body` chứa thông báo lỗi xảy ra.
 */
export const addSubscriberToTopic = async (req, res) => {
  const novu = new Novu(process.env.NOVU_API_KEY);
  try {
    // Get the subscriber ID from the request body
    const subscriberId = req.body.subscriberId;

    // Get the topic key from the request body
    const topicKey = req.body.topicKey;

    // Call Novu SDK to add the subscriber to the topic
    const result = await novu.topics.addSubscribers(topicKey, {
      subscribers: [subscriberId],
    });

    // Return the result as JSON response
    res.json(CircularJSON.stringify(result));
  } catch (error) {
    res.status(500).json(CircularJSON.stringify({ message: error.message }));
  }
};

/**
 * Gửi thông báo cho topic
 * 
 * *Topic là một nhóm các subcrbers cùng nhận thông báo về một sự kiện nào đó*
 * @param {*} req - Thông tin front-end gửi về cho back-end
 * @param {*} res - Thông tin back-end gửi cho front-end.
 * Nếu thành công, `res` có `status` là 200 và `body` chứa kết quả.
 * Nếu thất bại, `res` có `status` là 500 và `body` chứa thông báo lỗi xảy ra.
 */
export const sendNotificationToTopic = async (req, res) => {
  const novu = new Novu(process.env.NOVU_API_KEY);

  try {
    // Get the topic key from the request body
    const topicKey = req.body.topicKey;
    const title = req.body.title;
    const description = req.body.description;

    // Call Novu SDK to trigger a notification to the topic subscribers
    const result = await novu.trigger("momentum--L67FbJvt", {
      to: [{ type: "Topic", topicKey: topicKey }],
      payload: {
        title: title,
        description: description,
      },
    });

    // Return the result as JSON response
    res.json(CircularJSON.stringify(result));
  } catch (error) {
    res.status(500).json(CircularJSON.stringify({ message: error.message }));
  }
};
