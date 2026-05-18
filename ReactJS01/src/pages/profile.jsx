import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { clearError, clearSuccess, fetchProfile, updateProfile } from "../Redux/profileSlice";
import { setUser } from "../Redux/authSlice";

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().split("T")[0];
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { user, loading, error, success } = useSelector((state) => state.profile);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: "",
    bio: "",
    dateOfBirth: "",
    gender: "Other",
  });

  useEffect(() => {
    dispatch(fetchProfile());

    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    const source = user || authUser;

    if (source) {
      setFormState({
        name: source.name || "",
        phone: source.phone || "",
        address: source.address || "",
        avatar: source.avatar || "",
        bio: source.bio || "",
        dateOfBirth: toDateInputValue(source.dateOfBirth),
        gender: source.gender || "Other",
      });
    }
  }, [user, authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(updateProfile(formState));

    if (updateProfile.fulfilled.match(action)) {
      dispatch(setUser(action.payload));
    }
  };

  const currentUser = user || authUser;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-8 rounded-[32px] border border-black/10 bg-white/85 p-8 shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">Hồ sơ thành viên</p>
            <h1 className="mt-3 text-3xl font-black text-coffee">
              {currentUser?.name || "Thành viên"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Đây là trang riêng để xem và chỉnh sửa thông tin tài khoản. Phần thông tin thành viên trên trang chủ đã
              được tách ra thành khu vực này.
            </p>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#dcfce7_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">
              Quyền truy cập
            </p>
            <p className="mt-2 text-lg font-extrabold text-coffee">{currentUser?.role || "user"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Email đang dùng: <span className="font-semibold">{currentUser?.email || "Chưa cập nhật"}</span>
            </p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tóm tắt</p>
            <p className="mt-2 leading-7 text-slate-600">
              Admin, manager và user đều vào được hệ thống. Nếu bạn muốn tạo admin hoặc manager, chỉ cần đổi trường
              `role` của user trong MongoDB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Họ và tên</label>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
              />
            </div>
            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Số điện thoại</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(event) => setFormState({ ...formState, phone: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Địa chỉ</label>
            <input
              type="text"
              value={formState.address}
              onChange={(event) => setFormState({ ...formState, address: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
            />
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Đường dẫn ảnh đại diện</label>
            <input
              type="text"
              value={formState.avatar}
              onChange={(event) => setFormState({ ...formState, avatar: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Ngày sinh</label>
              <input
                type="date"
                value={formState.dateOfBirth}
                onChange={(event) => setFormState({ ...formState, dateOfBirth: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
              />
            </div>
            <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Giới tính</label>
              <select
                value={formState.gender}
                onChange={(event) => setFormState({ ...formState, gender: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-slate-50 px-5 py-4">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Giới thiệu</label>
            <textarea
              rows="5"
              value={formState.bio}
              onChange={(event) => setFormState({ ...formState, bio: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white px-4 py-3 outline-none transition focus:border-coffee"
            />
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Cập nhật thông tin thành công.
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={loading}>
              Lưu thông tin
            </Button>
            <Button type="button" variant="ghost" onClick={() => dispatch(fetchProfile())}>
              Tải lại hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
