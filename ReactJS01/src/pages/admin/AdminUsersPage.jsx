import { useEffect, useState } from "react";
import {
  getAdminUsersApi,
  updateAdminUserApi,
  deleteAdminUserApi,
} from "../../util/api";

const roles = ["admin", "manager", "user"];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAdminUsersApi();
    setLoading(false);
    if (res?.EC === 0) {
      setUsers(res.data);
      setError("");
      return;
    }
    setError(res?.EM || "Không lấy được danh sách người dùng.");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    const res = await updateAdminUserApi(id, { role });
    if (res?.EC === 0) {
      setUsers((current) =>
        current.map((user) => (user._id === id ? res.data : user)),
      );
      setError("");
      return;
    }
    setError(res?.EM || "Không thể cập nhật quyền.");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa người dùng này không?");
    if (!confirmed) return;

    const res = await deleteAdminUserApi(id);
    if (res?.EC === 0) {
      setUsers((current) => current.filter((user) => user._id !== id));
      setError("");
      return;
    }
    setError(res?.EM || "Không thể xóa người dùng.");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-coffee/10 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-coffee">Quản lý người dùng</h2>
        <p className="mt-2 text-sm text-slate-600">
          Danh sách tài khoản và phân quyền. Admin có thể thay đổi role hoặc xóa người dùng.
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-coffee/10 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm font-semibold text-slate-700">Danh sách người dùng</p>
        </div>
        <div className="p-4">
          {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Tên</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Role</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Tạo ngày</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Cập nhật</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-[0.16em]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      Chưa có người dùng.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.name || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <select
                          value={user.role}
                          onChange={(event) => handleRoleChange(user._id, event.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{formatDate(user.updatedAt)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUsersPage;
