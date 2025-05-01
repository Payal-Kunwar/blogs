'use client';

import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/loginUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if(res.status === 409){
        setErrorMessage(data.message || 'Login failed');
      }
      if (res.ok) {
        localStorage.setItem('token', data.token); 
        router.push('/blogs');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setErrorMessage('Something went wrong, please try again later');
    }
  };

  return (
    <div className='flex justify-center items-center mt-[10%]'>
      <Card title='Login Here'>
        <div className='flex flex-col justify-center items-center'>
          <div className='m-2'>
            <InputText 
              value={email} 
              placeholder='Email' 
              type='email' 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full" 
            />
          </div>
          <div className='m-2'>
            <InputText 
              value={password} 
              placeholder='Password' 
              type='password' 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full" 
            />
          </div>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          <Button 
            size="small" 
            className='self-center' 
            severity="success" 
            outlined  
            label='Login' 
            onClick={handleSubmit}
            disabled={!email || !password}
          />
          <p className='mt-2'>New User? <Link className='text-blue' href="/register">Register</Link></p>
        </div>
      </Card>
    </div>
  );
}
