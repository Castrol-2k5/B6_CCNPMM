import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { registerThunk } from "../store/authSlice";

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [localError, setLocalError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLocalError("");
        if (!formState.name || !formState.email || !formState.password) {
            setLocalError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        const result = await dispatch(registerThunk(formState));
        if (registerThunk.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Đăng ký để bắt đầu quản lý dự án, theo dõi tiến độ và nhận thông báo." 
            footer={
                <span>
                    Đã có tài khoản?{" "}
                    <Link className="text-reef hover:text-ink" to="/login">
                        Đăng nhập ngay
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Họ và tên"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Nguyen Van A"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                />
                <Input
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />
                {localError || error ? (
                    <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
                        {localError || error}
                    </div>
                ) : null}
                <div className="flex flex-wrap gap-3">
                    <Button type="submit" loading={loading} className="w-full">
                        Tạo tài khoản
                    </Button>
                    <Link to="/" className="w-full">
                        <Button variant="ghost" className="w-full">
                            Về trang chủ
                        </Button>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
