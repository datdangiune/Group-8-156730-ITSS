# Group-8-156730-ITSS
Dự án Hệ thống quản lý thú cưng được thiết kế để hỗ trợ quản lý các tác vụ trong trung tâm chăm sóc thú cưng. Hệ thống bao gồm 4 thành phần chính:
**Backend:** Cung cấp API cho toàn bộ hệ thống.
**Frontend:**
- petpals-manager: Giao diện người dùng (customer).
- furry-system-manager: Giao diện quản lý (admin).
- vetstaff-connect: Giao diện dành cho bác sĩ thú y và nhân viên hỗ trợ.

**Công nghệ sử dụng**
**- Backend:**
Node.js, Express, Sequelize, PostgreSQL.
JWT (Xác thực), Multer (Upload file), Cloudinary (Lưu trữ hình ảnh).
**- Frontend:**
React.js.
Axios (Kết nối API).
Tailwind CSS (Giao diện).
React Router (Điều hướng).

**Hướng dẫn cài đặt**
**1. Clone Backend**
git clone https://github.com/datdangiune/Group-8-156730-ITSS.git

**2. Cài đặt thư viện**
Dùng 3 terminal khác nhau:
cd backend
npm install

cd petpals-manager
npm install

cd vetstaff-connect
npm install

**3. Cấu hình môi trường**
Tạo file .env trong thư mục backend với nội dung sau:

JWT_SECRET= thaiha

CLOUDINARY_NAME=xxx
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=xxx

EMAIL_NAME = xxx
APP_PASSWORD = xxx
(inbox Datto để lấy full).

**4. Chạy Server**
cd backend
npm start

**5. Chạy Frontend**
cd vào từng folder
npm run dev
Hệ thống sẽ hoạt động với backend và 3 frontend kết nối đồng bộ.

**6. Cách login account admin**
"/login" vào link 
vet@gmail.com
123
