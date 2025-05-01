
"use client"
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');


  const handleSumbit = async () => {
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); 
        router.push('/login');
      } else {
        setErrorMessage(data.message || 'Register failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setErrorMessage('Something went wrong, please try again later');
    }
  }
    return (
      <>
        <div className='flex justify-center items-center mt-[10%]'>
          <Card title='Register Here'>
            <div className='flex flex-col'>
              <div className='m-2'>
                <InputText value={email} placeholder='email' type='email' onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='m-2'>
                <InputText value={password} placeholder='password' type='password' onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button size="small" className='self-center' severity="success" outlined  onClick={handleSumbit}>Register</Button>
            </div>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <p className='p-2'>Already have an Account? <Link className='text-blue' href="/login">Login</Link></p>
          </Card>
        </div>
      </>
    );
  }