
import { addUser, findUser } from '@/app/users';

export async function POST(req) {
  const { email, password } = await req.json();
    const userExists = await findUser(email, password);
    console.log(userExists)
  if (userExists) {
    return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
  }
  console.log("Hi")
  addUser(email, password);

  return new Response(JSON.stringify({ message: 'Registered successfully' }), { status: 201 });
}