import { jwtVerify } from 'jose';

const validateToken = async (token) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  };

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
        
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return new Response(
          JSON.stringify({ error: 'Authorization token not provided' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    const token = await validateToken(authHeader.split(' ')[1]);  
    if(!token){
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
  
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const all = await res.json();
  
    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + limit);
  
    return new Response(JSON.stringify(paginated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }