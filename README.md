# FullStack Mouse Keyboard Shop

Project gồm:
- `ExpressJS01`: backend Node.js + Express + MongoDB
- `ReactJS01`: frontend React + Vite

## Yêu cầu

- Node.js 18+
- MongoDB đang chạy local

## Cấu hình mặc định

Backend đang dùng file `ExpressJS01/.env` với cấu hình mặc định:

```env
PORT=8080
MONGO_DB_URL=mongodb://localhost:27017/fullstack01
```

Frontend cần gọi đúng backend. Nếu cần, tạo file `ReactJS01/.env.development`:

```env
VITE_BACKEND_URL=http://localhost:8080
```

## Cách chạy lần đầu

### 1. Cài backend

```bash
cd ExpressJS01
npm install
```

### 2. Seed dữ liệu sản phẩm mẫu

```bash
npm run seed
```

Lệnh này sẽ tạo/cập nhật dữ liệu mẫu sản phẩm trong MongoDB để test:
- danh sách sản phẩm
- lazy loading
- top 10 bán chạy
- top 10 xem nhiều

### 3. Chạy backend

```bash
npm run dev
```

Backend mặc định chạy tại:

```bash
http://localhost:8080
```

### 4. Cài frontend

Mở terminal mới:

```bash
cd ReactJS01
npm install
```

### 5. Chạy frontend

```bash
npm run dev
```

Frontend mặc định chạy tại:

```bash
http://localhost:5173
```

## Khi clone project

Sau khi clone repo, cần chạy đúng các bước:

```bash
cd ExpressJS01
npm install
npm run seed
npm run dev
```

Mở terminal mới:

```bash
cd ReactJS01
npm install
npm run dev
```

Nếu không chạy `npm run seed`, phần sản phẩm trong database có thể không có dữ liệu đầy đủ.

## Ghi chú

- File seed nằm tại `ExpressJS01/seed/seedProducts.js`

