import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get('fecha');

    // Llama al procedimiento almacenado para generar el reporte de ventas
    const result = await query("SELECT * FROM generar_reporte_ventas($1)", [fecha]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al generar reporte de ventas:', error);
    return NextResponse.json({ message: 'Error al generar reporte', error: error }, { status: 500 });
  }
}
