import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('sessiontoken')?.value
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
        const { payload } = await jwtVerify(token, secret)
        if (!payload) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        console.log('Payload:', payload)

        if (payload.role != '2' && request.nextUrl.pathname.startsWith('/amin/home')) {
            return NextResponse.redirect(new URL('/home', request.url))
        }


        if (payload.role != '2' && request.nextUrl.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/home', request.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error('JWT verification failed:', error)
        return NextResponse.redirect(new URL('/', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/home', '/admin/:path*'],
}