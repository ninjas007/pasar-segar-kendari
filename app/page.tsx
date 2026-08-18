"use client";
import { useMemo, useState } from "react";
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  altUnit?: string;
  image: string;
  badge?: string;
  description: string;
  origin: string;
};
type CartItem = Product & {
  qty: number;
  selectedUnit: string;
  unitPrice: number;
};
const products: Product[] = [
  {
    id: 1,
    name: "Beras Pandan Wangi",
    category: "Beras & Sembako",
    price: 17500,
    unit: "kg",
    altUnit: "5 kg",
    image: "/assets/beras.jpg",
    badge: "Paling laris",
    description:
      "Beras pulen pilihan dengan aroma pandan alami. Cocok untuk kebutuhan makan harian keluarga.",
    origin: "Cianjur, Jawa Barat",
  },
  {
    id: 2,
    name: "Telur Ayam Negeri",
    category: "Peternakan",
    price: 32000,
    unit: "kg",
    altUnit: "10 butir",
    image: "/assets/telur.jpg",
    badge: "Segar hari ini",
    description:
      "Telur ayam segar berkualitas, disortir satu per satu dan dikirim dengan kemasan aman.",
    origin: "Bogor, Jawa Barat",
  },
  {
    id: 3,
    name: "Daging Sapi Segar",
    category: "Peternakan",
    price: 138000,
    unit: "kg",
    altUnit: "500 gr",
    image: "/assets/daging.jpg",
    description:
      "Daging sapi merah segar dengan potongan serbaguna untuk rendang, sop, atau tumisan.",
    origin: "Boyolali, Jawa Tengah",
  },
  {
    id: 4,
    name: "Ikan Kembung",
    category: "Ikan & Seafood",
    price: 46000,
    unit: "kg",
    altUnit: "500 gr",
    image: "/assets/ikan.jpg",
    badge: "Baru tiba",
    description:
      "Ikan kembung segar hasil tangkapan nelayan lokal, kaya protein dan omega-3.",
    origin: "Batam, Kepulauan Riau",
  },
  {
    id: 5,
    name: "Paket Sayur Sop",
    category: "Sayur & Buah",
    price: 12000,
    unit: "paket",
    image: "/assets/sayur.jpg",
    description:
      "Paket praktis berisi wortel, kentang, kol, daun bawang, dan seledri untuk satu kali masak.",
    origin: "Kebun Mitra Lokal",
  },
  {
    id: 6,
    name: "Tomat Merah",
    category: "Sayur & Buah",
    price: 14000,
    unit: "kg",
    altUnit: "500 gr",
    image: "/assets/tomat.jpg",
    description:
      "Tomat merah matang pilihan, segar untuk sambal, jus, maupun masakan sehari-hari.",
    origin: "Berastagi, Sumatera Utara",
  },
  {
    id: 7,
    name: "Cabai Merah Keriting",
    category: "Sayur & Buah",
    price: 48000,
    unit: "kg",
    altUnit: "250 gr",
    image: "/assets/cabai.jpg",
    badge: "Harga panen",
    description:
      "Cabai merah keriting segar dengan tingkat pedas pas dan warna merah alami.",
    origin: "Kerinci, Jambi",
  },
  {
    id: 8,
    name: "Minyak Goreng Premium",
    category: "Beras & Sembako",
    price: 38500,
    unit: "2 liter",
    altUnit: "1 liter",
    image: "/assets/minyak.jpg",
    description:
      "Minyak goreng jernih berkualitas untuk kebutuhan dapur rumah tangga.",
    origin: "Produk Indonesia",
  },
];
const money = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
export default function Home() {
  const [category, setCategory] = useState("Semua"),
    [search, setSearch] = useState(""),
    [cart, setCart] = useState<CartItem[]>([]),
    [cartOpen, setCartOpen] = useState(false),
    [detail, setDetail] = useState<Product | null>(null),
    [unit, setUnit] = useState(""),
    [sheet, setSheet] = useState<"info" | "contact" | null>(null);
  const categories = [
    "Semua",
    "Beras & Sembako",
    "Sayur & Buah",
    "Ikan & Seafood",
    "Peternakan",
  ];
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "Semua" || p.category === category) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search],
  );
  const priceFor = (p: Product, u: string) =>
    u.includes("500 gr")
      ? p.price / 2
      : u.includes("250 gr")
        ? p.price / 4
        : u.includes("5 kg")
          ? p.price * 5
          : u.includes("10 butir")
            ? 22000
            : u.includes("1 liter")
              ? 20500
              : p.price;
  function add(p: Product, u = p.unit) {
    const price = priceFor(p, u);
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id && x.selectedUnit === u);
      return i < 0
        ? [...c, { ...p, qty: 1, selectedUnit: u, unitPrice: price }]
        : c.map((x, n) => (n === i ? { ...x, qty: x.qty + 1 } : x));
    });
    setDetail(null);
    setCartOpen(true);
  }
  function change(index: number, d: number) {
    setCart((c) =>
      c
        .map((x, i) => (i === index ? { ...x, qty: x.qty + d } : x))
        .filter((x) => x.qty > 0),
    );
  }
  const total = cart.reduce((s, x) => s + x.unitPrice * x.qty, 0),
    count = cart.reduce((s, x) => s + x.qty, 0);
  function checkout() {
    if (!cart.length) return;
    const lines = cart
      .map(
        (x, i) =>
          `${i + 1}. ${x.name}\n   ${x.qty} x ${x.selectedUnit} — ${money(x.unitPrice * x.qty)}`,
      )
      .join("\n");
    const text = `Halo Pasar Segar Kendari, saya ingin memesan:\n\n${lines}\n\nTotal: ${money(total)}\n\nMohon info ketersediaan dan ongkirnya. Terima kasih.`;
    window.open(
      `https://wa.me/6282345567113?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setCart([]);
  }
  return (
    <main>
      <div className="topbar">
        🚚 Gratis ongkir untuk belanja minimal Rp150.000{" "}
        <span>• Pengiriman setiap hari</span>
      </div>
      <header>
        <a className="brand" href="#">
          <span>PS</span>
          <div>
            Pasar Segar<small>Kendari</small>
          </div>
        </a>
        <nav>
          <a href="#produk">Belanja</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#tentang">Tentang Kami</a>
        </nav>
        <button
          className="cartBtn"
          onClick={() => setCartOpen(true)}
          aria-label="Buka keranjang"
        >
          🛒 <b>{count}</b>
          <span>Keranjang</span>
        </button>
      </header>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">DARI PETANI & NELAYAN LOKAL</p>
          <h1>
            Segar dari sumbernya,
            <br />
            <em>sampai ke dapur Anda.</em>
          </h1>
          <p>
            Belanja beras, sayur, ikan, daging, dan kebutuhan pokok pilihan.
            Harga jujur, kualitas terjaga.
          </p>
          <a href="#produk" className="primary">
            Mulai belanja <b>→</b>
          </a>
          <div className="trust">
            <span>✓ Produk segar</span>
            <span>✓ Harga transparan</span>
            <span>✓ Pesan via WhatsApp</span>
          </div>
        </div>
        <div className="heroImage">
          <img src="/assets/hero.jpg" alt="Aneka bahan pangan segar di pasar" />
          <div className="floating">
            <span>🌿</span>
            <div>
              <b>Dipanen hari ini</b>
              <small>Langsung dari mitra lokal</small>
            </div>
          </div>
        </div>
      </section>
      <section className="categoryStrip">
        {categories.slice(1).map((c, i) => (
          <button key={c} onClick={() => setCategory(c)}>
            <i>{["🌾", "🥬", "🐟", "🥚"][i]}</i>
            <span>{c}</span>
            <small>Lihat pilihan →</small>
          </button>
        ))}
      </section>
      <section className="products" id="produk">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">PILIHAN HARI INI</p>
            <h2>Belanja kebutuhan segar</h2>
          </div>
          <label className="search">
            ⌕
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
            />
          </label>
        </div>
        <div className="filters">
          {categories.map((c) => (
            <button
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid">
          {filtered.map((p) => (
            <article className="card" key={p.id}>
              <div
                className="photo"
                onClick={() => {
                  setDetail(p);
                  setUnit(p.unit);
                }}
              >
                {p.badge && <span className="badge">{p.badge}</span>}
                <img src={p.image} alt={p.name} />
                <button aria-label={`Lihat ${p.name}`}>↗</button>
              </div>
              <div className="cardBody">
                <small>{p.category}</small>
                <h3
                  onClick={() => {
                    setDetail(p);
                    setUnit(p.unit);
                  }}
                >
                  {p.name}
                </h3>
                <div className="price">
                  <strong>{money(p.price)}</strong>
                  <span>/ {p.unit}</span>
                </div>
                <button className="add" onClick={() => add(p)}>
                  + Tambah ke keranjang
                </button>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <p className="empty">
            Produk tidak ditemukan. Coba kata kunci lainnya.
          </p>
        )}
      </section>
      <section className="why" id="keunggulan">
        <div>
          <p className="eyebrow">KENAPA MEMILIH KAMI?</p>
          <h2>Belanja pangan jadi lebih tenang.</h2>
          <p>
            Kami menghubungkan keluarga Indonesia dengan hasil terbaik dari
            petani, peternak, dan nelayan lokal.
          </p>
        </div>
        <div className="whyGrid">
          <article>
            <b>01</b>
            <h3>Segar terpilih</h3>
            <p>Setiap produk disortir sebelum dikirim ke rumah Anda.</p>
          </article>
          <article>
            <b>02</b>
            <h3>Satuan fleksibel</h3>
            <p>Belanja sesuai kebutuhan, per kilogram maupun per paket.</p>
          </article>
          <article>
            <b>03</b>
            <h3>Pesan mudah</h3>
            <p>Keranjang pesanan langsung diteruskan lewat WhatsApp.</p>
          </article>
        </div>
      </section>
      <footer id="tentang">
        <a className="brand">
          <span>PS</span>
          <div>
            Pasar Segar<small>Kendari</small>
          </div>
        </a>
        <p>Produk segar lokal untuk meja makan keluarga Indonesia.</p>
        <a href="https://wa.me/6282345567113">WhatsApp: +62 823-4556-7113</a>
        <small>© 2026 Pasar Segar Kendari</small>
      </footer>
      <div className="bottomNav">
        <button
          onClick={() => setSheet("info")}
          className={sheet === "info" ? "active" : ""}
        >
          <i>ⓘ</i>
          <span>Info</span>
        </button>
        <button onClick={() => setCartOpen(true)} className="navCart">
          <i>🛒</i>
          {count > 0 && <b>{count}</b>}
          <span>Keranjang</span>
        </button>
        <button
          onClick={() => setSheet("contact")}
          className={sheet === "contact" ? "active" : ""}
        >
          <i>☏</i>
          <span>Kontak</span>
        </button>
      </div>
      {sheet && (
        <div
          className="sheetOverlay"
          onMouseDown={(e) => e.target === e.currentTarget && setSheet(null)}
        >
          <section className="bottomSheet">
            <div className="sheetHandle" />
            <button className="sheetClose" onClick={() => setSheet(null)}>
              ×
            </button>
            {sheet === "info" ? (
              <>
                <div className="sheetTitle">
                  <span>🌿</span>
                  <div>
                    <small>TENTANG KAMI</small>
                    <h2>
                      Belanja lebih mudah,
                      <br />
                      hidup lebih segar.
                    </h2>
                  </div>
                </div>
                <p className="lead">
                  Pasar Segar Kendari hadir untuk memudahkan keluarga memenuhi
                  kebutuhan rumah tangga tanpa harus menghabiskan banyak waktu
                  di perjalanan.
                </p>
                <div className="infoCards">
                  <article>
                    <i>✓</i>
                    <div>
                      <h3>Produk pilihan</h3>
                      <p>
                        Kebutuhan pokok, sayur, ikan, dan hasil peternakan
                        dipilih dari mitra lokal tepercaya.
                      </p>
                    </div>
                  </article>
                  <article>
                    <i>⚖</i>
                    <div>
                      <h3>Harga dan satuan jelas</h3>
                      <p>
                        Setiap harga serta pilihan berat ditampilkan transparan
                        sebelum Anda memesan.
                      </p>
                    </div>
                  </article>
                  <article>
                    <i>▣</i>
                    <div>
                      <h3>Pemesanan praktis</h3>
                      <p>
                        Rincian keranjang langsung dikirim melalui WhatsApp
                        untuk konfirmasi stok dan ongkir.
                      </p>
                    </div>
                  </article>
                </div>
                <div className="policy">
                  <b>Kebijakan layanan</b>
                  <p>
                    Harga dan ketersediaan dapat berubah mengikuti kondisi
                    pasar. Pesanan dianggap terkonfirmasi setelah penjual
                    membalas melalui WhatsApp.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="sheetTitle">
                  <span>💬</span>
                  <div>
                    <small>HUBUNGI KAMI</small>
                    <h2>
                      Mari terhubung
                      <br />
                      dengan kami.
                    </h2>
                  </div>
                </div>
                <p className="lead">
                  Butuh bantuan atau ingin melihat kabar terbaru? Pilih saluran
                  yang paling nyaman untuk Anda.
                </p>
                <div className="socialCards">
                  <a href="https://wa.me/6282345567113" target="_blank">
                    <i className="whatsapp">◉</i>
                    <div>
                      <h3>WhatsApp</h3>
                      <p>Pesan dan layanan pelanggan</p>
                    </div>
                    <b>→</b>
                  </a>
                  <a
                    href="https://www.instagram.com/pasar_segar_kendari"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="instagram">◎</i>
                    <div>
                      <h3>Instagram</h3>
                      <p>@pasar_segar_kendari</p>
                    </div>
                    <b>→</b>
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="facebook">f</i>
                    <div>
                      <h3>Facebook</h3>
                      <p>Pasar Segar Kendari</p>
                    </div>
                    <b>→</b>
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="tiktok">♪</i>
                    <div>
                      <h3>TikTok</h3>
                      <p>@pasarsegarkendari</p>
                    </div>
                    <b>→</b>
                  </a>
                </div>
                <small className="dummyNote">
                  Akun media sosial masih berupa contoh dan dapat diganti
                  kemudian.
                </small>
              </>
            )}
          </section>
        </div>
      )}
      {detail && (
        <div
          className="overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <div className="modal detail">
            <button className="close" onClick={() => setDetail(null)}>
              ×
            </button>
            <img src={detail.image} alt={detail.name} />
            <div className="detailCopy">
              <small>{detail.category}</small>
              <h2>{detail.name}</h2>
              <p>{detail.description}</p>
              <div className="origin">
                📍 Asal produk: <b>{detail.origin}</b>
              </div>
              <label>Pilih satuan</label>
              <div className="unitPick">
                {[detail.unit, detail.altUnit].filter(Boolean).map((u) => (
                  <button
                    className={unit === u ? "selected" : ""}
                    onClick={() => setUnit(u!)}
                    key={u}
                  >
                    {u}
                    <small>{money(priceFor(detail, u!))}</small>
                  </button>
                ))}
              </div>
              <button
                className="primary full"
                onClick={() => add(detail, unit)}
              >
                + Tambah ke keranjang
              </button>
            </div>
          </div>
        </div>
      )}
      {cartOpen && (
        <div
          className="overlay cartOverlay"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setCartOpen(false)
          }
        >
          <aside className="cart">
            <div className="cartHead">
              <div>
                <small>PESANAN ANDA</small>
                <h2>
                  Keranjang <span>({count})</span>
                </h2>
              </div>
              <button onClick={() => setCartOpen(false)}>×</button>
            </div>
            <div className="cartItems">
              {!cart.length ? (
                <div className="emptyCart">
                  <i>🧺</i>
                  <h3>Keranjang masih kosong</h3>
                  <p>Pilih produk segar yang Anda butuhkan.</p>
                  <button onClick={() => setCartOpen(false)}>
                    Mulai belanja
                  </button>
                </div>
              ) : (
                cart.map((x, i) => (
                  <div className="cartItem" key={`${x.id}-${x.selectedUnit}`}>
                    <img src={x.image} alt="" />
                    <div>
                      <h4>{x.name}</h4>
                      <small>
                        {x.selectedUnit} · {money(x.unitPrice)}
                      </small>
                      <div className="qty">
                        <button onClick={() => change(i, -1)}>−</button>
                        <b>{x.qty}</b>
                        <button onClick={() => change(i, 1)}>+</button>
                      </div>
                    </div>
                    <strong>{money(x.unitPrice * x.qty)}</strong>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cartFoot">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </div>
                <small>Ongkos kirim akan dikonfirmasi melalui WhatsApp.</small>
                <button className="wa" onClick={checkout}>
                  <span>◉</span> Pesan lewat WhatsApp
                </button>
                <p>Anda akan diarahkan ke WhatsApp dengan rincian pesanan.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
