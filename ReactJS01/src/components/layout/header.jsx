import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Khuyến mãi", to: "/?featured=best" },
    { label: "Mới nhất", to: "/?featured=new" },
  ];

  if (user?.role === "admin") {
    navItems.push({ label: "Quản lý", to: "/admin" });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-coffee/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-coffee px-3 py-2 text-sm font-bold uppercase tracking-[0.3em] text-white">
            Gear
          </div>
          <div>
            <p className="text-lg font-bold text-coffee">Castrol Gear</p>
            <p className="text-xs text-slate-500">Cua hang chuot va ban phim</p>
          </div>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.to === "/profile"
                ? location.pathname === "/profile"
                : item.to === "/"
                  ? location.pathname === "/" && !location.search
                  : item.to.includes("?")
                    ? `${location.pathname}${location.search}` === item.to
                    : location.pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`text-sm font-medium transition ${
                  isActive ? "text-coffee" : "text-slate-600 hover:text-coffee"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-pine/20 bg-pine/10 px-4 py-2 text-sm text-pine sm:block">
                {user?.name || user?.email}
                <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs uppercase">
                  {user?.role || "user"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-full border border-coffee/15 px-4 py-2 text-sm font-semibold text-coffee transition hover:border-coffee hover:bg-coffee hover:text-white"
              >
                Thông tin thành viên
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-coffee px-4 py-2 text-sm font-semibold text-white transition hover:bg-copper"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-coffee/15 px-4 py-2 text-sm font-semibold text-coffee transition hover:border-coffee hover:bg-coffee hover:text-white"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:block"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
