# Giới thiệu về Moonshine Todo-app
![Logo](./assets/sunrise.png)

Chức năng của __Moonshine__ :
1. Hiển thị một câu trích dẫn có thể truyền cảm hứng, hiển thị thời gian hiện tại và hình nền ngẫu nhiên.
2. Lên kế hoạch cho các ngày.
3. Gửi lời nhắc cho bạn bè và đồng nghiệp về các công việc thông qua SMS và Email.
4. App có sẵn ở mọi nơi.

## Ảnh màn hình

![Thời gian hiện tại](./assets/Screenshot%202023-04-06%20at%201.01.25%20PM.png)
![Trung tâm thông báo của Moonshine](./assets/Screenshot%202023-04-07%20at%2011.40.35%20AM.png)
![Gửi email qua Moonshine](./assets/Screenshot%202023-04-07%20at%2011.31.40%20AM.png)
![Cập nhật todo và gửi lời nhắc sms](./assets/Screenshot%202023-04-07%20at%2011.34.46%20AM.png)

# Cài đặt database

Trong project này, chúng ta sẽ sử dụng MongoDB để lưu trữ dữ liệu.

## Tạo tài khoản MongoDB

Tạo tài khoản [MongoDB](https://www.mongodb.com) và đăng nhập

## Tạo project trong MongoDB

Tạo một project mới ở phía trên bên trái bằng cách bấm vào nút "New Project"
![Tạo project mới](./assets/Screenshot%202023-11-07%20152756.png)

Đặt tên cho Project rồi bấm "Next" và thêm thành viên (nếu có) rồi bấm "Create Project"
![Đặt tên Project](./assets/Screenshot%202023-11-07%20153531.png)
![Thêm thành viên Project](./assets/Screenshot%202023-11-07%20153806.png)

## Tạo Database 

 Bấm "Create" ở giữa màn hình để tạo một cloud database
 ![Tạo database](./assets/Screenshot%202023-11-07%20153924.png)

 Chọn lựa chọn miễn phí
 ![Lựa chọn](./assets/Screenshot%202023-11-07%20154055.png)

 Nhập username và password mà dùng để đăng nhập vào MongoDB, sau đó bấm "Create User"
 ![Tạo user](./assets/Screenshot%202023-11-07%20154951.png)

 Sau đó kéo xuống cuối, bấm "Finish and Close"
 ![Hoàn thành tạo database](./assets/Screenshot%202023-11-07%20154924.png)

## Kết nối với Database

Vào phần "Network Access", bấm "Add IP Address"
![Network Access](./assets/Screenshot%202023-11-07%20155205.png)

Chọn "Allow Access From Anywhere" và lưu lại
![Thêm địa chỉ IP](./assets/Screenshot%202023-11-07%20155323.png)

Trở về phần "Database" và bấm nút "Connect"
![Database](./assets/Screenshot%202023-11-07%20155507.png)

Chọn phần "Drivers" và copy connection url, thay vào `MONGO_CONNECTION_URL` ở trong file `.env`

# Cài đặt Novu

__Novu__ là một hạ tầng mã nguồn mở quản lý các thông báo. Nó cung cấp một API duy nhất giúp việc gửi các thông báo (ví dụ như In-App, SMS, Email,...) trở nên dễ dàng và tiện lợi hơn. Trong __Novu__, bạn có thể tự tạo một workflow và xác định các điều kiện để kích hoạt từng kênh thông báo.

## Tạo tài khoản

Vào [web platform của Novu](https://web.novu.co/) tạo tài khoản

## Kết nối Back-end với Novu

Vào phần Settings ở thanh điều hướng, copy __API KEY__ và thay vào `NOVU_API_KEY` trong file `.env`

![Novu api key](./assets/Screenshot%202024-01-29%20134512.png)


## Cài đặt các hàm kích hoạt Novu

### Cấu hình luồng gửi email
Luồng hoạt động
![Email workflow](./assets/Screenshot%202024-01-29%20135113.png)

Chi tiết bước gửi email
![Email step](./assets/Screenshot%202024-01-29%20135143.png)

### Cấu hình luồng gửi thông báo inapp
Luồng hoạt động
![In app workflow](./assets/Screenshot%202024-01-29%20135206.png)

Chi tiết bước gửi thông báo
![Inapp step](./assets/Screenshot%202024-01-29%20135228.png)

### Cấu hình luồng gửi tin nhắn sms
Luồng hoạt động
![Sms workflow](./assets/Screenshot%202024-01-29%20135325.png)

Chi tiết bước gửi email
![sms step](./assets/Screenshot%202024-01-29%20135406.png)


# Chạy web trên localhost

Trong đường dẫn thư mục back-end, sử dụng lệnh:

```bash
npm install
```
hoặc
```bash
npm i
```
Lệnh này sẽ cài đặt các package cần thiết cho project.  


```bash
npm start
```
Chạy ứng dụng ở môi trường develop

Dưới đây là kết quả khi chạy ứng dụng Moonshine ở localhost 

![Moonshine chạy trên localhost](./assets/Screenshot%202023-04-07%20at%2011.28.09%20AM.png)

# Biến môi trường

Để chạy project này, bạn cần thêm những biến môi trường sau vào file `.env`

`MONGO_CONNECTION_URL`: URL dùng để kết nối với MongoDB

`NOVU_API_KEY`: Novu API key của bạn

# Công nghệ sử dụng

## Client-side 
Novu, React, Redux, DotEnv, Axios, JWTEncode, Moment, React-Icons,...

## Server-side
Novu, Node, Express, MongoDB, Mongoose, BCrypt, JSONWebToken,...

## Triển khai
- Front-End: Vercel
- Back-End: Render

# Thông tin thêm
- Link github back-end: [https://github.com/hienhienn/todo-app-be](https://github.com/hienhienn/todo-app-be)
- Link github front-end: [https://github.com/hienhienn/todo-app-fe](https://github.com/hienhienn/todo-app-fe)
- Link back-end deploy trên render: [https://todo-app-be-ytia.onrender.com/](https://todo-app-be-ytia.onrender.com/)
- Link front-end deploy trên vercel: [https://todo-app-fe-ruby.vercel.app/](https://todo-app-fe-ruby.vercel.app/)
- Link jsdocs back-end: [https://todo-app-fe-asok.vercel.app/](https://todo-app-fe-asok.vercel.app/)
- Link jsdocs front-end: [https://todo-app-fe-asok.vercel.app/index.html](https://todo-app-fe-asok.vercel.app/index.html)

