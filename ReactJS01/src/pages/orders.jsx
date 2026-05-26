import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getOrdersHistoryApi, cancelOrderApi } from "../util/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")} ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
};

const STATUS_MAP = {
  1: { text: "Đơn hàng mới", color: "bg-blue-100 text-blue-800 border-blue-200" },
  2: { text: "Đã xác nhận", color: "bg-amber-100 text-amber-800 border-amber-200" },
  3: { text: "Đang chuẩn bị hàng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  4: { text: "Đang giao hàng", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  5: { text: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  6: { text: "Đã hủy đơn hàng", color: "bg-rose-100 text-rose-800 border-rose-200" },
};

const OrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || "");

  // Form hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrders = async (autoSelectId = null) => {
    try {
      const res = await getOrdersHistoryApi();
      if (res?.EC === 0) {
        setOrders(res.data);
        if (autoSelectId) {
          const updated = res.data.find((o) => o._id === autoSelectId);
          if (updated) setSelectedOrder(updated);
        } else if (selectedOrder) {
          // Đồng bộ lại dữ liệu mới nhất cho đơn hàng đang được chọn xem chi tiết
          const updated = res.data.find((o) => o._id === selectedOrder._id);
          if (updated) setSelectedOrder(updated);
        } else if (res.data.length > 0 && !selectedOrder) {
          setSelectedOrder(res.data[0]);
        }
      } else {
        setErrorMsg(res?.EM || "Không thể tải danh sách đơn hàng.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Lỗi kết nối tới hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tự tắt thông báo thành công sau 5 giây
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setCancelling(true);
    setErrorMsg("");
    try {
      const res = await cancelOrderApi(orderToCancel._id, cancelReason);
      if (res?.EC === 0) {
        setSuccessMsg(res.EM);
        setShowCancelModal(false);
        // Tải lại đơn hàng và tự động cập nhật chi tiết của đơn vừa hủy
        await fetchOrders(orderToCancel._id);
      } else {
        setErrorMsg(res.EM || "Hủy đơn hàng thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi gửi yêu cầu hủy đơn.");
    } finally {
      setCancelling(false);
    }
  };

  // Hàm tính xem đơn hàng có được tự hủy trực tiếp không (< 30 phút, status 1 hoặc 2)
  const canDirectCancel = (order) => {
    if (order.status !== 1 && order.status !== 2) return false;
    const createdAt = new Date(order.createdAt);
    const diffMinutes = (new Date() - createdAt) / 60000;
    return diffMinutes <= 30;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {successMsg && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-black text-coffee">Lịch sử mua hàng</h1>
        <p className="text-sm text-slate-500">
          Theo dõi trạng thái giao hàng và xem lịch sử đơn đặt hàng của bạn
        </p>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-slate-500">Đang tải lịch sử đơn hàng...</div>
      ) : orders.length === 0 ? (
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
              d="M9 12h3.75M9 15h3.375c1.08 0 1.968-.881 1.968-1.968v-.162c0-1.08-.88-1.968-1.968-1.968H9m1.5-6h7.5h-7.5zm0 0a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 0010.5 22h7.5A2.25 2.25 0 0020 19.75V6.25A2.25 2.25 0 0017.75 4h-7.5zM3 16.25v-10A2.25 2.25 0 015.25 4h1.5a2.25 2.25 0 012.25 2.25v10a2.25 2.25 0 01-2.25 2.25h-1.5A2.25 2.25 0 013 16.25z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-coffee">Chưa có đơn hàng nào</h2>
          <p className="mt-2 text-sm text-slate-500">
            Bạn chưa đặt mua chuột hay bàn phím nào trên website của chúng tôi.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-coffee px-6 py-3 text-sm font-bold text-white transition hover:bg-copper"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.8fr]">
          {/* Danh sách đơn hàng bên trái */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            <h3 className="text-lg font-bold text-coffee">Danh sách đơn hàng ({orders.length})</h3>
            {orders.map((order) => {
              const statusInfo = STATUS_MAP[order.status] || { text: "Không rõ", color: "bg-slate-100" };
              const isSelected = selectedOrder?._id === order._id;

              return (
                <button
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-5 rounded-[24px] border transition ${
                    isSelected
                      ? "border-coffee bg-white shadow-md ring-1 ring-coffee/20"
                      : "border-coffee/10 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Mã: {order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Ngày đặt: {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm font-semibold text-coffee mt-3">
                    {order.items.length} sản phẩm -{" "}
                    <span className="text-copper font-bold">{formatCurrency(order.totalAmount)}</span>
                  </p>
                </button>
              );
            })}
          </div>

          {/* Chi tiết đơn hàng đang chọn bên phải */}
          <div className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft space-y-6">
            {selectedOrder ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-coffee">
                      Đơn hàng #{selectedOrder._id.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Đặt lúc: {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      STATUS_MAP[selectedOrder.status]?.color
                    }`}>
                      {STATUS_MAP[selectedOrder.status]?.text}
                    </span>
                    
                    {/* Các nút Hủy đơn hàng */}
                    {selectedOrder.status !== 6 && selectedOrder.status !== 5 && selectedOrder.status !== 4 && (
                      <>
                        {canDirectCancel(selectedOrder) ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(selectedOrder)}
                            className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                          >
                            Hủy đơn hàng
                          </button>
                        ) : selectedOrder.status === 3 ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(selectedOrder)}
                            disabled={selectedOrder.cancelRequest?.isRequested}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold text-white transition ${
                              selectedOrder.cancelRequest?.isRequested
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600"
                            }`}
                          >
                            {selectedOrder.cancelRequest?.isRequested
                              ? "Đã gửi Y/C hủy"
                              : "Yêu cầu hủy đơn"}
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                {/* Yêu cầu hủy đang chờ duyệt */}
                {selectedOrder.cancelRequest?.isRequested && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 space-y-1">
                    <p className="text-sm font-bold text-orange-800">
                      Đang gửi yêu cầu hủy đơn cho Shop
                    </p>
                    <p className="text-xs text-orange-700">
                      Lý do hủy: {selectedOrder.cancelRequest.reason}
                    </p>
                    <p className="text-xs font-semibold text-orange-600 italic">
                      Trạng thái yêu cầu:{" "}
                      {selectedOrder.cancelRequest.status === "Pending"
                        ? "Đang chờ shop phê duyệt"
                        : selectedOrder.cancelRequest.status === "Approved"
                          ? "Đã chấp nhận"
                          : "Đã bị từ chối"}
                    </p>
                  </div>
                )}

                {/* Timeline Trạng Thái Đơn Hàng */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-coffee uppercase tracking-wider">
                    Hành trình đơn hàng
                  </h4>

                  <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const timelineItem = selectedOrder.statusTimeline.find(
                        (t) => t.status === step
                      );
                      const isCancelled = selectedOrder.status === 6;
                      
                      // Nếu đơn hàng bị hủy, các bước lịch sử đã đi qua vẫn hiển thị hoàn thành (màu xanh lá)
                      const isCompleted = isCancelled ? !!timelineItem : selectedOrder.status >= step;
                      const isCurrent = selectedOrder.status === step;

                      // Ẩn các bước tương lai chưa đạt được sau khi đơn hàng đã bị hủy
                      if (isCancelled && step > Math.max(...selectedOrder.statusTimeline.map(t => t.status).filter(s => s !== 6), 1)) {
                        return null;
                      }

                      return (
                        <div key={step} className="relative animate-fade-in">
                          {/* Dot */}
                          <div className={`absolute -left-[32px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-sm transition ${
                            isCompleted
                              ? isCurrent
                                ? "bg-copper"
                                : "bg-pine"
                              : "bg-slate-300"
                          }`}>
                            {isCompleted && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-3 w-3 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className={isCompleted ? "opacity-100" : "opacity-40"}>
                            <p className={`text-sm font-bold ${isCurrent ? "text-copper" : "text-coffee"}`}>
                              {step === 1 && "1. Đặt đơn thành công"}
                              {step === 2 && "2. Đã xác nhận đơn hàng"}
                              {step === 3 && "3. Shop đang đóng gói sản phẩm"}
                              {step === 4 && "4. Đang vận chuyển"}
                              {step === 5 && "5. Đã giao thành công"}
                            </p>
                            {timelineItem ? (
                              <>
                                <p className="text-[10px] text-slate-400">{formatDate(timelineItem.changedAt)}</p>
                                <p className="text-xs text-slate-600 mt-1">{timelineItem.note}</p>
                              </>
                            ) : (
                              isCurrent && step === 2 && (
                                <p className="text-xs text-amber-600 mt-1 italic">
                                  Đơn hàng sẽ tự động được hệ thống xác nhận sau 30 phút.
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Hiển thị bước Hủy đơn đặc biệt ở cuối nếu bị hủy */}
                    {selectedOrder.status === 6 && (() => {
                      const cancelItem = selectedOrder.statusTimeline.find((t) => t.status === 6);
                      return (
                        <div className="relative animate-fade-in">
                          <div className="absolute -left-[32px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-3 w-3 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-rose-600">Đơn hàng đã bị hủy</p>
                            {cancelItem ? (
                              <>
                                <p className="text-[10px] text-slate-400">{formatDate(cancelItem.changedAt)}</p>
                                <p className="text-xs text-rose-700 mt-1.5 font-medium bg-rose-50 border border-rose-100 px-3 py-2 rounded-2xl max-w-md">
                                  {cancelItem.note}
                                </p>
                              </>
                            ) : (
                              <p className="text-xs text-rose-700 mt-1.5 font-medium bg-rose-50 border border-rose-100 px-3 py-2 rounded-2xl max-w-md">
                                Hủy đơn hàng do có yêu cầu từ khách hàng.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Địa chỉ giao hàng và Thanh toán */}
                <div className="grid gap-6 border-t pt-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Thông tin người nhận</p>
                    <p className="text-sm font-bold text-coffee">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-xs text-slate-600">SĐT: {selectedOrder.shippingAddress.phone}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Địa chỉ: {selectedOrder.shippingAddress.address}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Thanh toán</p>
                    <p className="text-sm font-semibold text-coffee">
                      Hình thức: <span className="font-bold text-copper">{selectedOrder.paymentMethod}</span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Trạng thái thanh toán:{" "}
                      <span className={`font-bold ${
                        selectedOrder.paymentStatus === "Paid" ? "text-pine" : "text-rose-600"
                      }`}>
                        {selectedOrder.paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Danh sách sản phẩm đã đặt */}
                <div className="border-t pt-5 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase">Sản phẩm đã đặt</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images?.[0] || "https://placehold.co/150"}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg object-cover border"
                          />
                          <div>
                            <p className="font-bold text-coffee">{item.product.name}</p>
                            <p className="text-xs text-slate-500">
                              Số lượng: {item.quantity} x {formatCurrency(item.product.price)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-coffee">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng cộng */}
                <div className="border-t pt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-coffee">Tổng thanh toán đơn hàng:</span>
                  <span className="text-2xl font-black text-copper">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Vui lòng chọn một đơn hàng để xem hành trình vận chuyển.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Hủy Đơn Hàng */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCancelOrderSubmit}
            className="w-full max-w-md rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft space-y-4"
          >
            <h3 className="text-xl font-bold text-coffee">
              {orderToCancel?.status === 3 ? "Yêu cầu hủy đơn hàng" : "Hủy đơn hàng trực tiếp"}
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed">
              {orderToCancel?.status === 3
                ? "Đơn hàng này hiện đang ở trạng thái chuẩn bị sản phẩm. Yêu cầu hủy đơn cần được quản trị viên của shop duyệt trước."
                : "Đơn hàng của bạn sẽ được hủy trực tiếp ngay lập tức và hoàn trả số lượng chuột & bàn phím vào kho."}
            </p>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-semibold text-coffee">
                Lý do hủy đơn hàng (bắt buộc)
              </label>
              <textarea
                id="reason"
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do của bạn để shop xử lý nhanh hơn..."
                className="w-full rounded-2xl border border-coffee/15 bg-slate-50 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={cancelling || !cancelReason.trim()}
                className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-600 transition disabled:opacity-50"
              >
                {cancelling ? "Đang xử lý..." : "Xác nhận gửi"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
