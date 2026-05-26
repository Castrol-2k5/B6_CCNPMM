import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateCartItemThunk, removeCartItemThunk } from "../Redux/cartSlice";
import { useState } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const [errorMsg, setErrorMsg] = useState("");

  const cartItems = cart?.items || [];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handleQuantityChange = async (productId, currentQty, stock, change) => {
    setErrorMsg("");
    const newQty = currentQty + change;
    if (newQty < 1) return;
    if (newQty > stock) {
      setErrorMsg("Không thể chọn quá số lượng sản phẩm có sẵn trong kho.");
      return;
    }

    const res = await dispatch(
      updateCartItemThunk({ productId, quantity: newQty })
    );
    if (updateCartItemThunk.rejected.match(res)) {
      setErrorMsg(res.payload || "Lỗi khi cập nhật số lượng.");
    }
  };

  const handleRemoveItem = async (productId) => {
    setErrorMsg("");
    const res = await dispatch(removeCartItemThunk(productId));
    if (removeCartItemThunk.rejected.match(res)) {
      setErrorMsg(res.payload || "Lỗi khi xóa sản phẩm.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-coffee">Giỏ hàng của bạn</h1>
        <p className="text-sm text-slate-500">
          Quản lý các chuột và bàn phím bạn đã chọn trước khi thanh toán
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="mt-8 rounded-[32px] border border-coffee/10 bg-white p-12 text-center shadow-soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-slate-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-coffee">Giỏ hàng trống</h2>
          <p className="mt-2 text-sm text-slate-500">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-coffee px-6 py-3 text-sm font-bold text-white transition hover:bg-copper"
          >
            Khám phá chuột & bàn phím
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          {/* List items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-[28px] border border-coffee/10 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images?.[0] || "https://placehold.co/150"}
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover border border-slate-100"
                    />
                    <div>
                      <Link
                        to={`/products/${product.slug}`}
                        className="font-bold text-coffee hover:text-copper transition"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">
                        Thương hiệu: {product.brand} | Kho: {product.stock}
                      </p>
                      <p className="mt-2 text-sm font-bold text-copper">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 sm:border-t-0 sm:pt-0 gap-6">
                    {/* Số lượng */}
                    <div className="inline-flex items-center rounded-full border border-coffee/10 bg-slate-50">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity,
                            product.stock,
                            -1
                          )
                        }
                        disabled={loading}
                        className="px-3 py-1 text-base font-bold text-coffee hover:bg-slate-200 rounded-l-full transition"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-coffee">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            item.quantity,
                            product.stock,
                            1
                          )
                        }
                        disabled={loading || item.quantity >= product.stock}
                        className="px-3 py-1 text-base font-bold text-coffee hover:bg-slate-200 rounded-r-full transition disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Tổng dòng & Nút xóa */}
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-black text-coffee min-w-24 text-right">
                        {formatCurrency(product.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(product._id)}
                        disabled={loading}
                        className="rounded-full p-2 text-rose-500 hover:bg-rose-50 transition"
                        title="Xóa sản phẩm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout summary */}
          <div className="rounded-[32px] border border-coffee/10 bg-white p-6 shadow-soft h-fit space-y-6">
            <h3 className="text-xl font-bold text-coffee border-b pb-4">
              Tóm tắt đơn hàng
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Số lượng sản phẩm:</span>
                <span className="font-bold text-coffee">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tạm tính:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600 font-bold">Miễn phí</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-end">
              <span className="font-bold text-coffee">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-copper">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full rounded-full bg-coffee py-4 text-center text-sm font-bold text-white transition hover:bg-copper shadow-md"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to="/"
              className="block text-center text-sm font-semibold text-coffee/70 hover:text-coffee mt-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
