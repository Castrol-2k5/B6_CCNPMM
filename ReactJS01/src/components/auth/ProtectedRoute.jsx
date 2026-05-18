import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAccountThunk } from "../../Redux/authSlice";

const allowedRoles = ["admin", "manager", "user"];

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, appLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (appLoading) {
      dispatch(fetchAccountThunk());
    }
  }, [dispatch, appLoading]);

  if (appLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <div className="rounded-full border border-coffee/10 bg-white px-6 py-3 text-sm text-coffee shadow-soft">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace state={{ from: location, unauthorized: true }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
