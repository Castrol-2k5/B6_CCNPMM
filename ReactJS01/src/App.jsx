import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/layout/header";
import { fetchAccountThunk } from "./Redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const { appLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAccountThunk());
  }, [dispatch]);

  if (appLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <div className="rounded-full border border-coffee/10 bg-white px-6 py-3 text-sm text-coffee shadow-soft">
          Đang tải cửa hàng chuột và bàn phím...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand text-slate-900">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
