import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearFeedback, loginThunk } from "../Redux/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(clearFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.email || !formState.password) {
      setLocalError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLocalError("");
    await dispatch(loginThunk(formState));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#42210b_0%,#14532d_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft lg:grid-cols-[1fr_420px]">
        <div className="hidden bg-black/10 p-10 text-white lg:block">
          <p className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-100 shadow-sm ring-1 ring-white/20">Castrol Gear</p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-sand drop-shadow-[0_3px_12px_rgba(0,0,0,0.35)]">
            Đăng nhập thành viên để vào trang chủ bán chuột và bàn phím.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/90">
            Sau khi đăng nhập thành công, hệ thống hiển thị khuyến mãi, sản phẩm mới nhất, bán chạy nhất và thông tin tài khoản.
          </p>
        </div>
        <div className="p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-copper">Đăng nhập</p>
          <h2 className="mt-3 text-3xl font-black text-coffee">Chào mừng quay lại</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            />
            {(localError || error) && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {localError || error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-coffee px-5 py-3 text-sm font-bold text-white transition hover:bg-copper disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <Link to="/forgot-password" className="font-semibold text-copper">
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="font-semibold text-pine">
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
