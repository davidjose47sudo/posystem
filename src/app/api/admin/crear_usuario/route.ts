import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../DB';

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, contrasena, id_rol } = await req.json();

    // Llama al procedimiento almacenado para crear usuario
    await query("SELECT crear_usuario($1, $2, $3, $4)", [nombre, email, contrasena, id_rol]);

    return NextResponse.json({ message: 'Usuario creado exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error en la creación de usuario:', error);
    return NextResponse.json({ message: 'Error al crear usuario', error: error }, { status: 500 });
  }
}
