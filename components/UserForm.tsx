
'use client';
import { useState } from 'react';

export default function UserForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, createdAt: new Date() }),
    });
    const data = await res.json();
    if (data.success) setMessage('✅ User saved!');
    else setMessage('❌ Failed to save user.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Save User</button>
      {message && <p>{message}</p>}
    </form>
  );
}
