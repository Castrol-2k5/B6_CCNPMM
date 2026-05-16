import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearFeedback, forgotPasswordThunk } from "../Redux/authSlice";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(clearFeedback());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(forgotPasswordThunk({ email }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-copper">Hỗ trợ</p>
        <h1 className="mt-3 text-3xl font-black text-coffee">Quên mật khẩu</h1>
        <p className="mt-3 text-sm text-slate-600">
          Nhập email đã đăng ký, hệ thống sẽ ghi nhận yêu cầu khôi phục.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
          />
          {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-coffee px-5 py-3 text-sm font-bold text-white transition hover:bg-copper disabled:opacity-70"
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
        <Link to="/login" className="mt-5 inline-block text-sm font-semibold text-pine">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
