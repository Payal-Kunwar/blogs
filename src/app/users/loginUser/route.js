import { addUser, findUser } from '@/app/users';
import jwt from 'jsonwebtoken';
export async function POST(req) {
  const { email, password } = await req.json();
    const userExists = await findUser(email, password);
    console.log("userExists", userExists)
    if (!userExists) {
      return new Response(JSON.stringify({ message: 'User does not exist' }), { status: 409 });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token }), { status: 200 });
}