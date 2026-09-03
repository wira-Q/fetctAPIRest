'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: Params) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/API/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setName(json.data.name);
          setPrice(json.data.price);
          setStock(json.data.stock);
        } else {
          alert('Produk tidak ditemukan!');
          router.push('/products');
        }
      } catch (err) {
        console.error('Error fetching detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/API/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Produk berhasil diperbarui!');
        router.push('/products');
      } else {
        alert('Gagal update: ' + json.message);
      }
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  if (loading) return <p style={{ padding: '40px' }}>Loading detail produk...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: '-apple-system' }}>
      <h1>Edit Produk #{id}</h1>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label>Nama Produk:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div>
          <label>Harga (Rp):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div>
          <label>Stok:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Update Produk
        </button>
      </form>
    </div>
  );
}