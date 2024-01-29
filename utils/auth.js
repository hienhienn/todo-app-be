import jwt from "jsonwebtoken";

/**
 * `auth` xác thực quyền truy cập của người dùng
 * @param {Object} req - request (thông tin từ front-end gửi cho back-end)
 * @param {string} req.headers.authorization
 * @param {Object} res - response (thông tin back-end gửi về cho front-end)
 * @param {Function} next - hàm thực hiện tiếp theo sau khi xác thực
 */
const auth = async (req, res, next)=>{
    try {
			const token = req.headers.authorization.split(' ')[1];
			const isCustomAuth = token.length < 500;

			let decodedData;
			if (token && isCustomAuth) {
				decodedData = jwt.verify(token, 'secret');
				req.userId = decodedData?.id;
			}
			next();
		} catch (error) {
			console.log('auth middleware error', error);
		}
}

export default auth;
