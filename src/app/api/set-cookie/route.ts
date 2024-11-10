import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    const data = await req.json();
    console.log(data)
    var token = jwt.sign({ id_usuario: data.id_usuario, role: data.role }, process.env.JWT_SECRET || 'secret');
    const res = new Response('cookie creada', { status: 200 });
    if (!token) return new Response('Token is required', { status: 400 });
    res.headers.set('Set-Cookie', `sessiontoken=${token}; Path=/; expires=${new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString()}; SameSite=Lax`);
    return res;
}