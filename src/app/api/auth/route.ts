import { NextRequest, NextResponse } from 'next/server';
import { query } from '../DB';

export async function POST(req: NextRequest) {
  try {
    const { email, contrasena } = await req.json();
    console.log('email:', email, 'contrasena:', contrasena);
    // Llama al SP para el login
    const result = await query("SELECT login_usuario($1, $2)", [email, contrasena]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }

    // Retorna la información del usuario
    return NextResponse.json({id_usuario:result.rows[0].login_usuario[1],role:result.rows[0].login_usuario[3]}, { status: 200 });
  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ message: 'Error en el login', error }, { status: 400 });
  }
}
