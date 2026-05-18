import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/layout/header";

function App() {
  const { appLoading } = useSelector((state) => state.auth);

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
    <div className="min-h-screen overflow-x-hidden bg-sand text-slate-900">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
