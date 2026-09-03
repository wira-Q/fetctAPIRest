// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

// ==========================================
// 1. GET: Ambil Semua Produk
// ==========================================
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Gagal mengambil data dari Supabase',
        error_message: error.message,
        error_code: error.code,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      count: data ? data.length : 0,
      data: data || [],
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Server Crash / Unknown Error',
    }, { status: 500 });
  }
}
// ==========================================
// 2. POST: Tambah Produk Baru
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validasi data sederhana di level Gateway
    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json({
        success: false,
        message: 'Field "name" (string) dan "price" (number) wajib diisi!',
      }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('Products')
      .insert([
        {
          name: body.name,
          price: body.price,
          stock: body.stock ?? 0,
        },
      ])
      .select();
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Gagal menambah data ke Supabase',
        error_message: error.message,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dibuat!',
      data: data[0],
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Invalid JSON request body',
    }, { status: 400 });
  }
}