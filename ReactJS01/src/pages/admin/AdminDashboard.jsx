import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-[28px] border border-coffee/10 bg-slate-50 p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-coffee">Chào mừng admin</h2>
        <p className="mt-3 text-slate-600">
          Sử dụng menu bên trên hoặc các nút bên dưới để quản lý dữ liệu.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="rounded-full border border-coffee px-5 py-3 text-sm font-semibold text-coffee transition hover:bg-coffee hover:text-white"
          >
            Quản lý người dùng
          </Link>
          <Link
            to="/admin/products"
            className="rounded-full border border-coffee px-5 py-3 text-sm font-semibold text-coffee transition hover:bg-coffee hover:text-white"
          >
            Quản lý sản phẩm
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-coffee/10 bg-slate-50 p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-coffee">Hướng dẫn nhanh</h2>
        <ul className="mt-4 space-y-3 text-slate-600">
          <li>• Người dùng chỉ có thể đăng nhập nếu role là admin, manager hoặc user.</li>
          <li>• Chỉ admin mới truy cập được trang quản lý admin.</li>
          <li>• Tạo, cập nhật, xoá sản phẩm sẽ ảnh hưởng trực tiếp lên MongoDB.</li>
          <li>• Cập nhật role người dùng sẽ giúp phân quyền đăng nhập chính xác.</li>
        </ul>
      </div>
    </section>
  );
};

export default AdminDashboard;
