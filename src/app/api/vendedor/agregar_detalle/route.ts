import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function POST(req: NextRequest) {
  try {
    const { id_venta, detalles } = await req.json();

    // Agregar detalles de venta para cada producto
    for (const detalle of detalles) {
      const { id_producto, cantidad, precio_unitario } = detalle;
      await query("SELECT agregar_detalle_venta($1, $2, $3, $4)", [id_venta, id_producto, cantidad, precio_unitario]);
    }

    return NextResponse.json({ message: 'Detalles de venta agregados exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar detalles de venta:', error);
    return NextResponse.json({ message: 'Error al agregar detalles de venta', error: error }, { status: 500 });
  }
}
