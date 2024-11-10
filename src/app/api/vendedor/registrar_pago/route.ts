import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function POST(req: NextRequest) {
  try {
    const { id_venta, monto_pagado, metodo_pago } = await req.json();

    // Llama al procedimiento para registrar el pago
    await query("SELECT registrar_pago($1,$2,$3)", [id_venta, metodo_pago, monto_pagado]);

    return NextResponse.json({ message: 'Pago registrado exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    return NextResponse.json({ message: 'Error al registrar pago', error: error }, { status: 500 });
  }
}
