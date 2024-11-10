import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function POST(req: NextRequest) {
  try {
    const { nombre, descripcion, precio, stock } = await req.json();

    // Llama al procedimiento almacenado para crear un producto
    await query("SELECT crear_producto($1, $2, $3, $4)", [nombre, descripcion, precio, stock]);

    return NextResponse.json({ message: 'Producto creado exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ message: 'Error al crear producto', error: error }, { status: 500 });
  }
}
