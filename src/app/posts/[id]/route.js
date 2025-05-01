import { jwtVerify } from 'jose';

const validateToken = async (token) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
        
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Authorization token not provided' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const token = await validateToken(authHeader.split(' ')[1]);
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const id = parseInt(searchParams.get('id') || '1', 10);
  
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from external API' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const data = await res.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}