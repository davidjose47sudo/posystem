import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function POST(req: NextRequest) {
  try {
    const { id_usuario, total } = await req.json();

    // Registrar la venta y obtener el id de la venta
    const result = await query("SELECT registrar_venta($1, $2)", [id_usuario, total]);
    const id_venta = result.rows[0].registrar_venta;

    return NextResponse.json({ message: 'Venta registrada', id_venta }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return NextResponse.json({ message: 'Error al registrar venta', error: error }, { status: 500 });
  }
}
