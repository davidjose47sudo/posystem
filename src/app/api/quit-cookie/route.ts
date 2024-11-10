export async function POST() {
    const res = new Response('cookie eliminada', { status: 200 });
    res.headers.set('Set-Cookie', `sessiontoken=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`);
    return res;
}
