import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const menuItems = [
    { label: "Tổng quan", to: "/admin" },
    { label: "Người dùng", to: "/admin/users" },
    { label: "Sản phẩm", to: "/admin/products" },
    { label: "Đơn hàng", to: "/admin/orders" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-coffee/10 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">Khu vực quản trị</p>
            <h1 className="mt-2 text-3xl font-black text-coffee">Trang quản lý Admin</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Tại đây admin có thể quản lý người dùng, sản phẩm và đơn hàng của hệ thống.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-coffee bg-coffee text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-coffee hover:text-coffee"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
