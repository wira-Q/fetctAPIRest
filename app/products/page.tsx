// app/products/page.tsx
'use client';
import { useState, useEffect } from 'react';
type Product = {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  created_at?: string;
};
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  // ----------------------------------------------------
  // 1. READ: Fungsi Fetch Semua Produk (GET)
  // ----------------------------------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/API/products', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      } else {
        alert('Gagal mengambil data: ' + json.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  // ----------------------------------------------------
  // 2. CREATE: Fungsi Tambah Produk (POST)
  // ----------------------------------------------------
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Name dan Price wajib diisi!');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Produk berhasil ditambahkan!');
        // Reset form
        setName('');
        setPrice('');
        setStock('');
        // Refresh list
        fetchProducts();
      } else {
        alert('Gagal menambah produk: ' + json.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setSubmitting(false);
    }
  };
  // ----------------------------------------------------
  // 3. DELETE: Fungsi Hapus Produk (DELETE)
  // ----------------------------------------------------
  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`/API/products/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        // Refresh list setelah hapus
        fetchProducts();
      } else {
        alert('Gagal menghapus: ' + json.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1> Manajemen Produk (CRUD Consume API)</h1>
      {/* --- FORM TAMBAH PRODUK --- */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>Tambah Produk Baru</h2>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Nama Produk:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Mouse Wireless"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Harga (Rp):</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Stok:</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 16px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
      {/* --- DAFTAR PRODUK --- */}
      <h2>Daftar Produk</h2>
      {loading ? (
        <p>Memuat data produk...</p>
      ) : products.length === 0 ? (
        <p>Belum ada produk tersimpan.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama Produk</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Harga</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stok</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.stock}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
