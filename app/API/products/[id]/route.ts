// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type Params = {
  params: Promise<{ id: string }>;
};
// ==========================================
// 1. GET: Ambil Detail 1 Produk
// ==========================================
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('Products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return NextResponse.json({
        success: false,
        message: 'Produk tidak ditemukan',
        error_message: error?.message,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Internal Server Error',
    }, { status: 500 });
  }
}
// ==========================================
// 2. PUT: Update Produk
// ==========================================
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('Products')
      .update({
        name: body.name,
        price: body.price,
        stock: body.stock,
      })
      .eq('id', id)
      .select();
    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Gagal update atau produk tidak ditemukan',
        error_message: error?.message,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: 'Produk berhasil diperbarui!',
      data: data[0],
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Invalid Request Body',
    }, { status: 400 });
  }
}
// ==========================================
// 3. DELETE: Hapus Produk
// ==========================================
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('Products')
      .delete()
      .eq('id', id)
      .select();
    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Produk tidak ditemukan atau gagal dihapus',
        error_message: error?.message,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus!',
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Internal Server Error',
    }, { status: 500 });
  }
}