import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stock_minimo = parseInt(searchParams.get('stock_minimo') || '0', 10);

    // Llama al procedimiento almacenado para obtener productos con bajo stock
    const result = await query("SELECT * FROM productos_bajo_stock($1)", [stock_minimo]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos con bajo stock:', error);
    return NextResponse.json({ message: 'Error al obtener productos', error: error }, { status: 500 });
  }
}
