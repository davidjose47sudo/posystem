import { NextResponse } from 'next/server';
import { query } from '../DB';

export async function GET() {
  try {
    // Llama al procedimiento almacenado para obtener todos los usuarios
    const result = await query("SELECT id,nombre,precio FROM productos");

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ message: 'Error al obtener productos', error: error }, { status: 500 });
  }
}
