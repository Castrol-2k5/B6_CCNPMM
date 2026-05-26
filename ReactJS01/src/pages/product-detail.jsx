import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetailApi } from "../util/api";
import { addToCartThunk } from "../Redux/cartSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setFeedback({ type: "error", msg: "Vui lòng đăng nhập trước khi mua hàng!" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    setAdding(false);
    setFeedback({ type: "", msg: "" });

    if (product.stock < 1) {
      setFeedback({ type: "error", msg: "Sản phẩm hiện đang tạm hết hàng!" });
      return;
    }

    setAdding(true);
    const resultAction = await dispatch(addToCartThunk({ productId: product._id, quantity }));
    setAdding(false);

    if (addToCartThunk.fulfilled.match(resultAction)) {
      setFeedback({ type: "success", msg: "Thêm vào giỏ hàng thành công!" });
      setTimeout(() => setFeedback({ type: "", msg: "" }), 3000);
    } else {
      setFeedback({ type: "error", msg: resultAction.payload || "Lỗi khi thêm sản phẩm." });
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await getProductDetailApi(slug);
      if (res?.EC === 0) {
        setProduct(res.data);
        setActiveImage(0);
        setQuantity(1);
      }
    };

    fetchDetail();
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-8 shadow-soft">Đang tải chi tiết sản phẩm...</div>
      </div>
    );
  }

  const isMouse = product.dpi > 0;

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? product.images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === product.images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/" className="text-sm font-semibold text-copper">
        Quay lại trang chủ
      </Link>

      <section className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-coffee/10 bg-white p-5 shadow-soft">
          <div className="relative overflow-hidden rounded-[28px] bg-slate-100">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-[420px] w-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-coffee"
                >
                  Trước
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-coffee"
                >
                  Tiếp
                </button>
              </>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-[20px] border-2 ${
                  activeImage === index ? "border-copper" : "border-transparent"
                }`}
              >
                <img src={image} alt={`${product.name}-${index + 1}`} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Danh mục: {product.category}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {product.connectivity}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-black text-coffee">{product.name}</h1>
            <p className="mt-3 text-slate-600">{product.description}</p>

            <div className="mt-6 flex items-end gap-4">
              <p className="text-3xl font-black text-copper">{formatCurrency(product.price)}</p>
              <p className="text-lg text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Hàng tồn</p>
                <p className="text-xl font-bold text-pine">{product.stock} sản phẩm</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Đã bán</p>
                <p className="text-xl font-bold text-coffee">{product.sold} sản phẩm</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{isMouse ? "DPI" : "Khối lượng"}</p>
                <p className="text-xl font-bold text-coffee">
                  {isMouse ? product.dpi : `${product.weight}g`}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-coffee/10">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="px-4 py-3 text-lg font-bold text-coffee"
                >
                  -
                </button>
                <span className="min-w-14 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.min(product.stock, current + 1))
                  }
                  className="px-4 py-3 text-lg font-bold text-coffee"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding || product.stock < 1}
                className="rounded-full bg-coffee px-6 py-3 text-sm font-bold text-white transition hover:bg-copper disabled:opacity-50"
              >
                {adding ? "Đang thêm..." : product.stock < 1 ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
            </div>

            {feedback.msg && (
              <div
                className={`mt-4 rounded-2xl px-4 py-2 text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {feedback.msg}
              </div>
            )}

            <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#ecfccb_100%)] p-5">
              <p className="text-sm font-semibold text-copper">Khuyến mãi hiện tại</p>
              <p className="mt-2 text-sm text-slate-700">{product.promotion}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft">
            <h2 className="text-2xl font-bold text-coffee">Thông số nổi bật</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-coffee/10 p-4 text-sm text-slate-600">
              Thuộc danh mục <span className="font-bold text-coffee">{product.category}</span>, phù hợp cho người dùng ưu tiên {product.connectivity.toLowerCase()} và khối lượng {product.weight}g.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[32px] border border-coffee/10 bg-white p-7 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-copper">Sản phẩm tương tự</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {product.similarProducts.map((item) => (
            <Link key={item.id} to={`/products/${item.slug}`} className="rounded-[24px] bg-slate-50 p-4">
              <img src={item.images[0]} alt={item.name} className="h-40 w-full rounded-[20px] object-cover" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-500">{item.brand}</p>
              <h3 className="mt-2 text-lg font-bold text-coffee">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.category}</p>
              <p className="mt-4 text-xl font-black text-copper">{formatCurrency(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
