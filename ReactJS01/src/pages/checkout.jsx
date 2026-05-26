import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrderApi } from "../util/api";
import { fetchCartThunk } from "../Redux/cartSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartItems = cart?.items || [];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrSimulated, setQrSimulated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Tạo URL mã QR giả lập từ api của VietQR
  useEffect(() => {
    if (paymentMethod !== "COD" && totalAmount > 0) {
      const bankId = paymentMethod === "MOMO" ? "momo" : "vnpay";
      const accountNo = "0987654321";
      const accountName = "NGUYEN HUU TRUNG";
      const desc = `CASTROLGEAR DATHANG ${user?.name ? user.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase() : "KHACH"}`;
      // Sử dụng QR template của Quick VietQR
      const url = `https://img.vietqr.io/image/970415-0987654321-compact2.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(accountName)}`;
      setQrCodeUrl(url);
    }
  }, [paymentMethod, totalAmount, user]);

  useEffect(() => {
    // Nếu giỏ hàng trống thì không cho thanh toán
    if (!loading && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      setErrorMsg("Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ nhận hàng.");
      return;
    }

    // Nếu chọn ví điện tử nhưng chưa mở giao diện QR giả lập để thanh toán
    if (paymentMethod !== "COD" && !qrSimulated) {
      setQrSimulated(true);
      return;
    }

    setLoading(true);
    try {
      const res = await createOrderApi(shippingAddress, paymentMethod);
      if (res?.EC === 0) {
        // Tải lại giỏ hàng trong Redux để xóa badge
        dispatch(fetchCartThunk());
        // Chuyển sang trang theo dõi đơn hàng
        navigate("/orders", {
          state: { successMsg: "Đặt hàng thành công! Bạn có thể theo dõi đơn hàng tại đây." },
        });
      } else {
        setErrorMsg(res?.EM || "Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-black text-coffee">Thanh toán đơn hàng</h1>
        <p className="text-sm text-slate-500">
          Vui lòng nhập địa chỉ nhận hàng và chọn phương thức thanh toán phù hợp
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Form thông tin và phương thức */}
        <div className="space-y-6">
          {!qrSimulated ? (
            <form onSubmit={handlePlaceOrder} className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft space-y-6">
              <h2 className="text-xl font-bold text-coffee border-b pb-3">
                1. Thông tin giao hàng
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-coffee">Họ và tên người nhận</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-coffee/15 bg-slate-50 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-coffee">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-coffee/15 bg-slate-50 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                    placeholder="09XXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-semibold text-coffee">Địa chỉ nhận hàng cụ thể</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-coffee/15 bg-slate-50 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành Phố"
                />
              </div>

              <h2 className="text-xl font-bold text-coffee border-b pb-3 pt-4">
                2. Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === "COD" ? "border-coffee bg-coffee/5" : "border-slate-200 bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-coffee h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-bold text-coffee">COD (Thanh toán khi nhận hàng)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Khách hàng thanh toán tiền mặt trực tiếp cho shipper khi nhận được chuột & bàn phím.</p>
                  </div>
                </label>

                {/* MOMO */}
                <label className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === "MOMO" ? "border-coffee bg-coffee/5" : "border-slate-200 bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    checked={paymentMethod === "MOMO"}
                    onChange={() => setPaymentMethod("MOMO")}
                    className="accent-coffee h-4 w-4"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-coffee">Ví điện tử MoMo (Giả lập QR)</p>
                      <p className="text-xs text-slate-500 mt-0.5">Quét mã QR MoMo để thanh toán online an toàn, nhanh chóng.</p>
                    </div>
                    <div className="rounded-lg bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">MOMO</div>
                  </div>
                </label>

                {/* VNPAY */}
                <label className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === "VNPAY" ? "border-coffee bg-coffee/5" : "border-slate-200 bg-slate-50"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => setPaymentMethod("VNPAY")}
                    className="accent-coffee h-4 w-4"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-coffee">Cổng thanh toán VNPay (Giả lập QR)</p>
                      <p className="text-xs text-slate-500 mt-0.5">Hỗ trợ quét QR từ hơn 40 ứng dụng ngân hàng di động phổ biến.</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">VNPAY</div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-coffee py-4 text-sm font-bold text-white transition hover:bg-copper shadow-md mt-6"
              >
                {paymentMethod === "COD" ? "Xác nhận đặt hàng (COD)" : "Tiếp tục quét mã QR thanh toán"}
              </button>
            </form>
          ) : (
            /* Giao diện quét mã QR giả lập */
            <div className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft text-center space-y-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQrSimulated(false)}
                  className="rounded-full bg-slate-100 p-2 text-coffee hover:bg-slate-200 transition"
                  title="Quay lại"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7-5m-7 5h17.5" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-coffee">
                  Thanh toán qua mã QR {paymentMethod}
                </h2>
              </div>

              <div className="mx-auto max-w-[280px] rounded-3xl border border-slate-200 p-4 bg-white shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt={`Mã QR chuyển khoản ${paymentMethod}`}
                  className="mx-auto w-full object-contain rounded-2xl"
                />
                <div className="mt-3 rounded-2xl bg-amber-50 p-2 text-xs font-bold text-amber-800">
                  QR demo - Chuyển khoản thực tế hoặc quét thử nghiệm
                </div>
              </div>

              <div className="space-y-2 text-left max-w-md mx-auto bg-slate-50 p-5 rounded-3xl border border-coffee/5">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Thông tin chuyển khoản</p>
                <div className="flex justify-between text-sm py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <span className="font-bold text-coffee">NGUYEN HUU TRUNG</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Ví / Số tài khoản:</span>
                  <span className="font-bold text-coffee">0987654321</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-black text-copper">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500">Nội dung CK:</span>
                  <span className="font-bold text-pine uppercase bg-pine/5 px-2 py-0.5 rounded">
                    CASTROLGEAR DATHANG {user?.name ? user.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase() : "KHACH"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => handlePlaceOrder(null)}
                  disabled={loading}
                  className="w-full rounded-full bg-pine py-4 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? "Đang xử lý..." : "Tôi đã quét QR và thanh toán thành công"}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setQrSimulated(false)}
                  className="text-sm font-semibold text-slate-500 hover:text-coffee"
                >
                  Chọn phương thức thanh toán khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tóm tắt sản phẩm đã chọn */}
        <div className="rounded-[32px] border border-coffee/10 bg-white p-6 shadow-soft h-fit space-y-6">
          <h3 className="text-xl font-bold text-coffee border-b pb-4">
            Đơn hàng của bạn
          </h3>

          <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id} className="flex gap-3 text-sm">
                  <img
                    src={product.images?.[0] || "https://placehold.co/150"}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-coffee line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Số lượng: {item.quantity} x {formatCurrency(product.price)}
                    </p>
                  </div>
                  <span className="font-bold text-coffee">
                    {formatCurrency(product.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tạm tính:</span>
              <span className="font-semibold text-coffee">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Phí giao hàng:</span>
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            </div>
            <div className="flex justify-between items-end border-t pt-3 mt-3">
              <span className="font-bold text-coffee">Tổng số tiền:</span>
              <span className="text-2xl font-black text-copper">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
              * Vui lòng đảm bảo thông tin giao hàng chính xác. Đơn hàng mới sẽ được duyệt tự động sau 30 phút đặt đơn thành công hoặc được xác nhận thủ công bởi admin.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
