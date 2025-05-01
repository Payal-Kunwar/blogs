import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // to access cookies for auth
import { jwtVerify } from 'jose';
const validateToken = async (token) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  };
export async function middleware(request) {
    //   const token = cookies().get('auth_token');
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
        const token = await validateToken(authHeader.split(' ')[1]);
        console.log("Valid user", token);
        if (token && ((pathname.startsWith('/login') || pathname.startsWith('/register')))) {
            return NextResponse.next(new URL('/blogs', request.url));
        }
        return NextResponse.next();
      } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
}

export const config = {
    matcher: ['/home'],
};

