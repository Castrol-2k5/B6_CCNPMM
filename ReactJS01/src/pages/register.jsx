import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearFeedback, registerThunk } from "../Redux/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(clearFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      navigate("/login");
    }
  }, [message, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name || !formState.email || !formState.password) {
      setLocalError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setLocalError("");
    await dispatch(registerThunk(formState));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#dcfce7_100%)] px-4 py-10">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-copper">Đăng ký</p>
        <h1 className="mt-3 text-3xl font-black text-coffee">Tạo tài khoản user</h1>
        <p className="mt-3 text-sm text-slate-600">
          Tài khoản đăng ký mới mặc định sẽ có role `user`. Nếu cần `admin` hoặc `manager`, bạn có thể đổi role
          trong MongoDB.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
          />
          <input
            type="email"
            placeholder="Email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
          />
          <input
            type="password"
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
            className="w-full rounded-full bg-pine px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-semibold text-coffee">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
