import { useEffect, useState } from "react";
import {
  getProductsApi,
  createAdminProductApi,
  updateAdminProductApi,
  deleteAdminProductApi,
} from "../../util/api";

const initialFormState = {
  id: "",
  slug: "",
  name: "",
  category: "",
  categorySlug: "",
  brand: "",
  price: "",
  originalPrice: "",
  stock: "",
  sold: "",
  rating: "",
  isNew: false,
  isBestSeller: false,
  promotion: "",
  connectivity: "",
  dpi: "",
  weight: "",
  description: "",
  features: "",
  images: "",
};

const normalizeList = (value = "") =>
  value
    .toString()
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProductsApi();
    setLoading(false);
    if (res?.EC === 0) {
      setProducts(res.data || []);
      setError("");
      return;
    }
    setError(res?.EM || "Không thể tải sản phẩm.");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingId("");
    setError("");
  };

  const handleInput = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSaveProduct = async () => {
    const payload = {
      ...formState,
      price: Number(formState.price) || 0,
      originalPrice: Number(formState.originalPrice) || 0,
      stock: Number(formState.stock) || 0,
      sold: Number(formState.sold) || 0,
      rating: Number(formState.rating) || 0,
      dpi: Number(formState.dpi) || 0,
      weight: Number(formState.weight) || 0,
      features: normalizeList(formState.features),
      images: normalizeList(formState.images),
    };

    const action = editingId
      ? await updateAdminProductApi(editingId, payload)
      : await createAdminProductApi(payload);

    if (action?.EC === 0) {
      fetchProducts();
      resetForm();
      return;
    }
    setError(action?.EM || "Không thể lưu sản phẩm.");
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormState({
      id: product.id || "",
      slug: product.slug || "",
      name: product.name || "",
      category: product.category || "",
      categorySlug: product.categorySlug || "",
      brand: product.brand || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      stock: product.stock?.toString() || "",
      sold: product.sold?.toString() || "",
      rating: product.rating?.toString() || "",
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      promotion: product.promotion || "",
      connectivity: product.connectivity || "",
      dpi: product.dpi?.toString() || "",
      weight: product.weight?.toString() || "",
      description: product.description || "",
      features: (product.features || []).join(", "),
      images: (product.images || []).join("\n"),
    });
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmed) return;

    const res = await deleteAdminProductApi(id);
    if (res?.EC === 0) {
      setProducts((current) => current.filter((product) => product._id !== id));
      setError("");
      return;
    }
    setError(res?.EM || "Không thể xóa sản phẩm.");
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[24px] border border-coffee/10 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-coffee">Quản lý sản phẩm</h2>
        <p className="mt-2 text-sm text-slate-600">
          Thêm mới, chỉnh sửa hoặc xoá sản phẩm. Ảnh sản phẩm được lưu dưới dạng URL.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[24px] border border-coffee/10 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-coffee">{editingId ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}</h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-coffee hover:text-coffee"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-4">
            {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
            {[
              ["id", "Mã sản phẩm"],
              ["slug", "Slug"],
              ["name", "Tên sản phẩm"],
              ["category", "Danh mục"],
              ["categorySlug", "Slug danh mục"],
              ["brand", "Thương hiệu"],
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm text-slate-700">
                <span>{label}</span>
                <input
                  value={formState[key]}
                  onChange={(event) => handleInput(key, event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-coffee"
                />
              </label>
            ))}

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["price", "Giá"],
                ["originalPrice", "Giá gốc"],
                ["stock", "Tồn kho"],
                ["sold", "Đã bán"],
                ["rating", "Đánh giá"],
                ["dpi", "DPI"],
                ["weight", "Trọng lượng (g)"],
                ["connectivity", "Kết nối"],
              ].map(([key, label]) => (
                <label key={key} className="grid gap-2 text-sm text-slate-700">
                  <span>{label}</span>
                  <input
                    value={formState[key]}
                    onChange={(event) => handleInput(key, event.target.value)}
                    type={key === "rating" || key === "price" || key === "originalPrice" || key === "stock" || key === "sold" || key === "dpi" || key === "weight" ? "number" : "text"}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-coffee"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formState.isNew}
                  onChange={(event) => handleInput("isNew", event.target.checked)}
                />
                <span>Sản phẩm mới</span>
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formState.isBestSeller}
                  onChange={(event) => handleInput("isBestSeller", event.target.checked)}
                />
                <span>Sản phẩm bán chạy</span>
              </label>
            </div>

            {[
              ["promotion", "Khuyến mãi"],
              ["description", "Mô tả"],
              ["features", "Tính năng (phân cách dấu phẩy)"] ,
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm text-slate-700">
                <span>{label}</span>
                <textarea
                  value={formState[key]}
                  onChange={(event) => handleInput(key, event.target.value)}
                  rows={key === "description" ? 4 : 2}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-coffee"
                />
              </label>
            ))}

            <label className="grid gap-2 text-sm text-slate-700">
              <span>Ảnh sản phẩm (mỗi URL 1 dòng)</span>
              <textarea
                value={formState.images}
                onChange={(event) => handleInput("images", event.target.value)}
                rows={4}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-coffee"
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProduct}
                className="rounded-full bg-coffee px-6 py-3 text-sm font-semibold text-white transition hover:bg-copper"
              >
                {editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-coffee hover:text-coffee"
              >
                Làm mới form
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-coffee/10 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-bold text-coffee">Danh sách sản phẩm</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Thương hiệu</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Tồn kho</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      Đang tải sản phẩm...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      Chưa có sản phẩm.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-4 text-slate-700">{product.name}</td>
                      <td className="px-4 py-4 text-slate-700">{product.brand}</td>
                      <td className="px-4 py-4 text-slate-700">{product.price.toLocaleString("vi-VN")} đ</td>
                      <td className="px-4 py-4 text-slate-700">{product.stock}</td>
                      <td className="px-4 py-4 text-slate-700">{product.isBestSeller ? "Best" : product.isNew ? "New" : "-"}</td>
                      <td className="px-4 py-4 text-slate-700">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="rounded-full border border-coffee px-3 py-2 text-xs font-semibold text-coffee transition hover:bg-coffee hover:text-white"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="rounded-full border border-rose-500 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductsPage;
