import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useEffect } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountThunk } from "./Redux/authSlice";

function App() {

    const dispatch = useDispatch();
    const { appLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchAccountThunk());
    }, [dispatch]);

    return (
        <div>
            {appLoading === true ?
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>

                    <Spin />

                </div>
                :
                <>
                    <Header />
                    <Outlet />
                </>
            }
        </div>
    )
}

export default App
