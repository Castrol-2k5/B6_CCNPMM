import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { fetchAccountThunk, logout } from "../Redux/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, appLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountThunk());
    }
  }, [dispatch, user]);

  if (appLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Đang tải hồ sơ...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[28px] border border-black/10 bg-white/80 p-8 shadow-soft">
          <h2 className="text-3xl font-black text-coffee">Bạn chưa đăng nhập</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Hãy đăng nhập để xem thông tin hồ sơ cá nhân của bạn.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login">
              <Button>Đăng nhập</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">Về trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-8 rounded-[32px] border border-black/10 bg-white/85 p-8 shadow-soft md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">Hồ sơ thành viên</p>
            <h1 className="mt-3 text-3xl font-black text-coffee">
              Xin chào, {user?.name || "bạn"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Đây là khu vực quản lý thông tin tài khoản đã đăng nhập trên hệ thống Castrol Gear.
            </p>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#dcfce7_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">
              Trạng thái
            </p>
            <p className="mt-2 text-lg font-extrabold text-coffee">Đang hoạt động</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bạn đang đăng nhập và có thể tiếp tục xem sản phẩm, nhận ưu đãi và đăng xuất khi cần.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => dispatch(fetchAccountThunk())}>Làm mới</Button>
            <Button variant="ghost" onClick={() => dispatch(logout())}>
              Đăng xuất
            </Button>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Họ và tên</p>
            <p className="mt-2 text-lg font-bold text-coffee">{user?.name || "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
            <p className="mt-2 break-all text-base font-semibold text-slate-800">
              {user?.email || "Chưa cập nhật"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Vai trò</p>
              <p className="mt-2 inline-flex rounded-full bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-coffee">
                {user?.role || "member"}
              </p>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nguồn tạo</p>
              <p className="mt-2 text-base font-semibold text-slate-800">
                {user?.createdBy || "Hệ thống"}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gợi ý</p>
            <p className="mt-2 leading-7 text-slate-600">
              Nếu bạn muốn mở rộng hồ sơ với số điện thoại, địa chỉ hoặc avatar, mình có thể nối lại API
              profile và phần form chỉnh sửa cho trang này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
