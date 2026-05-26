import { useState, useEffect } from "react";
import {
  getAdminOrdersApi,
  updateOrderStatusByAdminApi,
  handleCancelRequestByAdminApi,
} from "../../util/api";

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
  3: { text: "Shop đang chuẩn bị hàng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  4: { text: "Đang giao hàng", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  5: { text: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  6: { text: "Đã hủy đơn hàng", color: "bg-rose-100 text-rose-800 border-rose-200" },
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal hủy đơn của admin
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [adminSelectStatus, setAdminSelectStatus] = useState("");

  useEffect(() => {
    if (selectedOrder) {
      setAdminSelectStatus(selectedOrder.status.toString());
    }
  }, [selectedOrder]);

  const handleAdminUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    const newStatus = parseInt(adminSelectStatus);
    if (newStatus === selectedOrder.status) {
      return;
    }

    if (newStatus === 6) {
      setCancelReason("");
      setShowCancelModal(true);
      return;
    }

    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await updateOrderStatusByAdminApi(selectedOrder._id, newStatus);
      if (res?.EC === 0) {
        setSuccessMsg(res.EM || "Cập nhật trạng thái đơn hàng thành công!");
        await fetchAllOrders(selectedOrder._id);
      } else {
        setErrorMsg(res.EM || "Cập nhật thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAllOrders = async (autoSelectId = null) => {
    try {
      const res = await getAdminOrdersApi();
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
        setErrorMsg(res?.EM || "Không thể tải danh sách đơn hàng hệ thống.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Lỗi kết nối tới hệ thống backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (statusNum, noteText = "") => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await updateOrderStatusByAdminApi(selectedOrder._id, statusNum);
      if (res?.EC === 0) {
        setSuccessMsg(res.EM || "Cập nhật trạng thái đơn hàng thành công!");
        await fetchAllOrders(selectedOrder._id);
      } else {
        setErrorMsg(res.EM || "Cập nhật thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async (action) => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await handleCancelRequestByAdminApi(selectedOrder._id, action);
      if (res?.EC === 0) {
        setSuccessMsg(res.EM || "Đã xử lý yêu cầu hủy đơn thành công!");
        await fetchAllOrders(selectedOrder._id);
      } else {
        setErrorMsg(res.EM || "Xử lý yêu cầu thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Có lỗi xảy ra khi xử lý yêu cầu.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setShowCancelModal(false);

    try {
      const res = await updateOrderStatusByAdminApi(selectedOrder._id, 6);
      if (res?.EC === 0) {
        setSuccessMsg("Đã hủy đơn hàng và hoàn trả hàng lại kho!");
        await fetchAllOrders(selectedOrder._id);
      } else {
        setErrorMsg(res.EM || "Hủy đơn hàng thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Có lỗi xảy ra khi hủy đơn.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-coffee/10 pb-4">
        <h1 className="text-2xl font-black text-coffee">Quản lý Đơn hàng</h1>
        <p className="text-sm text-slate-500">
          Xem danh sách đơn hàng toàn hệ thống và cập nhật trạng thái xử lý
        </p>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center text-slate-500 py-10">Đang tải dữ liệu đơn hàng...</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.8fr]">
          {/* Danh sách đơn hàng bên trái */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-coffee">Mới nhất</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Tổng: {orders.length}
              </span>
            </div>

            {orders.map((order) => {
              const isSelected = selectedOrder?._id === order._id;
              const statusInfo = STATUS_MAP[order.status] || { text: "Không rõ", color: "bg-slate-100" };
              const customerName = order.userId?.name || order.shippingAddress.name;

              return (
                <button
                  key={order._id}
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setSelectedOrder(order);
                  }}
                  className={`w-full text-left p-5 rounded-[24px] border transition ${
                    isSelected
                      ? "border-coffee bg-white shadow-md ring-1 ring-coffee/20"
                      : "border-coffee/10 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      ID: {order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-bold text-coffee line-clamp-1">{customerName}</p>
                    <p className="text-xs text-slate-500 mt-1">SĐT: {order.shippingAddress.phone}</p>
                    <p className="text-xs text-slate-400 mt-1">Đặt lúc: {formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center border-t border-slate-50 pt-3">
                    <span className="text-xs text-slate-400">
                      {order.items.length} món
                    </span>
                    <span className="text-sm font-bold text-copper">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  {order.cancelRequest?.isRequested && order.cancelRequest.status === "Pending" && (
                    <div className="mt-3 rounded-xl bg-orange-50 border border-orange-200 px-3 py-1.5 text-center text-xs font-bold text-orange-800 animate-pulse">
                      Cần xử lý yêu cầu hủy đơn
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chi tiết đơn hàng & Actions bên phải */}
          <div className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft space-y-6">
            {selectedOrder ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-coffee">
                      Đơn hàng #{selectedOrder._id.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Khách hàng: <span className="font-bold text-coffee">{selectedOrder.userId?.name || "N/A"} ({selectedOrder.userId?.email || "N/A"})</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center ${
                    STATUS_MAP[selectedOrder.status]?.color
                  }`}>
                    {STATUS_MAP[selectedOrder.status]?.text}
                  </span>
                </div>

                {/* Xử lý yêu cầu hủy đơn */}
                {selectedOrder.cancelRequest?.isRequested && selectedOrder.cancelRequest.status === "Pending" && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 space-y-3">
                    <div>
                      <p className="text-sm font-bold text-orange-950">
                        ⚠️ YÊU CẦU HỦY ĐƠN HÀNG TỪ KHÁCH HÀNG
                      </p>
                      <p className="text-xs text-orange-800 mt-1">
                        Lý do khách hàng đưa ra: <span className="font-semibold italic">"{selectedOrder.cancelRequest.reason}"</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Yêu cầu lúc: {formatDate(selectedOrder.cancelRequest.requestedAt)}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleCancelRequest("approve")}
                        disabled={actionLoading}
                        className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition"
                      >
                        Đồng ý hủy đơn (Hoàn kho)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelRequest("reject")}
                        disabled={actionLoading}
                        className="rounded-full bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
                      >
                        Từ chối hủy & tiếp tục chuẩn bị
                      </button>
                    </div>
                  </div>
                )}

                {/* Bảng điều khiển Trạng thái Đơn hàng cho Admin */}
                <div className="rounded-2xl border border-coffee/10 bg-slate-50 p-5 space-y-4">
                  <h4 className="text-sm font-bold text-coffee uppercase tracking-wider">
                    Cập nhật trạng thái đơn hàng (Admin)
                  </h4>
                  
                  {selectedOrder.status === 5 || selectedOrder.status === 6 ? (
                    <p className="text-xs font-semibold text-slate-500">
                      {selectedOrder.status === 5 
                        ? "🎉 Đơn hàng đã hoàn thành (Giao thành công). Không thể thay đổi trạng thái." 
                        : "❌ Đơn hàng đã bị hủy. Không thể thay đổi trạng thái."}
                    </p>
                  ) : (
                    <form onSubmit={handleAdminUpdateStatusSubmit} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-slate-500 font-bold">Chọn trạng thái mới:</label>
                          <select
                            value={adminSelectStatus}
                            onChange={(e) => setAdminSelectStatus(e.target.value)}
                            disabled={actionLoading}
                            className="w-full rounded-xl border border-coffee/15 bg-white px-3 py-2.5 text-sm focus:border-coffee focus:outline-none"
                          >
                            <option value="1" disabled={selectedOrder.status > 1}>1. Đơn hàng mới</option>
                            <option value="2" disabled={selectedOrder.status > 2}>2. Đã xác nhận đơn hàng</option>
                            <option value="3" disabled={selectedOrder.status > 3}>3. Shop đang chuẩn bị hàng</option>
                            <option value="4" disabled={selectedOrder.status > 4}>4. Đang giao hàng</option>
                            <option value="5" disabled={selectedOrder.status > 5}>5. Đã giao thành công</option>
                            <option value="6">6. Hủy đơn hàng</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading || parseInt(adminSelectStatus) === selectedOrder.status}
                          className="rounded-xl bg-coffee px-5 py-2.5 text-xs font-bold text-white hover:bg-copper transition disabled:opacity-50 h-fit"
                        >
                          {actionLoading ? "Đang xử lý..." : "Cập nhật"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Timeline Hành Trình */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-coffee uppercase tracking-wider">
                    Nhật ký hành trình đơn hàng
                  </h4>
                  <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const timelineItem = selectedOrder.statusTimeline.find(
                        (t) => t.status === step
                      );
                      const isCancelled = selectedOrder.status === 6;
                      const isCompleted = isCancelled ? !!timelineItem : selectedOrder.status >= step;
                      const isCurrent = selectedOrder.status === step;

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
                            {timelineItem && (
                              <>
                                <p className="text-[10px] text-slate-400">{formatDate(timelineItem.changedAt)}</p>
                                <p className="text-xs text-slate-600 mt-1">{timelineItem.note}</p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

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
                                Đơn hàng bị hủy do quản trị viên hoặc có yêu cầu từ khách.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Thông tin vận chuyển và Khách hàng */}
                <div className="grid gap-6 border-t pt-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Thông tin người nhận</p>
                    <p className="text-sm font-bold text-coffee">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-xs text-slate-600">SĐT: {selectedOrder.shippingAddress.phone}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Địa chỉ giao: {selectedOrder.shippingAddress.address}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Thanh toán & Thanh toán</p>
                    <p className="text-sm font-semibold text-coffee">
                      Phương thức: <span className="font-bold text-copper">{selectedOrder.paymentMethod}</span>
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

                {/* Danh sách chuột & bàn phím */}
                <div className="border-t pt-5 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase">Sản phẩm đặt mua</p>
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

                <div className="border-t pt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-coffee">Doanh thu đơn hàng:</span>
                  <span className="text-2xl font-black text-copper">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Chọn một đơn hàng ở cột bên trái để cập nhật tiến độ xử lý.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận hủy của Admin */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAdminCancelSubmit}
            className="w-full max-w-md rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft space-y-4"
          >
            <h3 className="text-xl font-bold text-coffee">Admin Hủy Đơn Hàng</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Số lượng chuột & bàn phím tương ứng sẽ được tự động hoàn trả vào kho hàng sản phẩm.
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
                placeholder="Nhập lý do hủy từ phía cửa hàng..."
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
                disabled={actionLoading || !cancelReason.trim()}
                className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-600 transition disabled:opacity-50"
              >
                {actionLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
