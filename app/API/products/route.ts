// app/api/products/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// ==========================================
// CORS
// ==========================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ==========================================
// OPTIONS
// ==========================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ==========================================
// GET: Ambil Semua Produk
// ==========================================

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil data dari Supabase',
          error_message: error.message,
          error_code: error.code,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: data?.length ?? 0,
        data: data ?? [],
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Server Crash / Unknown Error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// ==========================================
// POST: Tambah Banyak Produk Sekaligus
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Harus berupa array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Body harus berupa array JSON',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Cek array tidak kosong
    if (body.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data tidak boleh kosong',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validasi setiap produk
    for (let i = 0; i < body.length; i++) {
      const product = body[i];

      if (
        typeof product.name !== 'string' ||
        product.name.trim() === '' ||
        typeof product.price !== 'number' ||
        typeof product.stock !== 'number'
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Data pada index ${i} tidak valid`,
            detail: {
              name: 'harus string',
              price: 'harus number',
              stock: 'harus number',
            },
          },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }
    }

    // INSERT 300 data sekaligus
    const { data, error } = await supabaseAdmin
      .from('Products')
      .insert(body)
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal menambah data ke Supabase',
          error_message: error.message,
          error_code: error.code,
          error_details: error.details,
          error_hint: error.hint,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${data?.length ?? 0} produk berhasil ditambahkan!`,
        count: data?.length ?? 0,
        data: data ?? [],
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Request tidak valid',
        error: err?.message || 'Invalid JSON request body',
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}