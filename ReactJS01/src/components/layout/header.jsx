import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { useEffect } from "react";
import { fetchCartThunk, clearCartState } from "../../Redux/cartSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const totalCartItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    } else {
      dispatch(clearCartState());
    }
  }, [dispatch, isAuthenticated]);

  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Khuyến mãi", to: "/?featured=best" },
    { label: "Mới nhất", to: "/?featured=new" },
  ];

  if (isAuthenticated) {
    navItems.push({ label: "Đơn hàng của tôi", to: "/orders" });
  }

  if (user?.role === "admin") {
    navItems.push({ label: "Quản lý đơn hàng", to: "/admin/orders" });
  }

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
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
            <p className="text-xs text-slate-500">Cửa hàng chuột và bàn phím</p>
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
                  isActive ? "text-coffee font-semibold border-b-2 border-coffee pb-1" : "text-slate-600 hover:text-coffee"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/cart"
              className="relative mr-2 rounded-full p-2 text-coffee transition hover:bg-coffee/10"
              title="Giỏ hàng"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">
                  {totalCartItems}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-pine/20 bg-pine/10 px-4 py-2 text-sm text-pine sm:block">
                {user?.name || user?.email}
                <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs uppercase font-bold text-pine border border-pine/10">
                  {user?.role || "user"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-full border border-coffee/15 px-4 py-2 text-sm font-semibold text-coffee transition hover:border-coffee hover:bg-coffee hover:text-white"
              >
                Cá nhân
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
