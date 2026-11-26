import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, message } from '../api';
import { useAuth } from '../context/AuthContext';
import type { LoginResponse } from '../types';
export function AuthForm({ register }: { register: boolean }) {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [busy, setBusy] = useState(false);
 const navigate = useNavigate();
 const { signIn } = useAuth();
 async function submit(e: FormEvent<HTMLFormElement>) {
 e.preventDefault(); setError('');
 if (register && (!name.trim() || name.trim().length > 100)) {
 setError('Nombre obligatorio, máximo 100 caracteres'); return;
 }
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
 setError('Correo inválido'); return;
 }
 if (!password || (register && (password.length < 8 || password.length > 72))) {
 setError(register ? 'Contraseña de 8 a 72 caracteres' : 'Ingresa contraseña');
 return;
 }
 setBusy(true);
 try {
 if (register) {
 await api.post('/auth/register', {
 name: name.trim(), email: email.trim(), password
 });
 navigate('/login', { replace: true });
 } else {
 const r = await api.post<LoginResponse>('/auth/login', {
 email: email.trim(), password
 });
 signIn(r.data.token);
 navigate('/dashboard', { replace: true });
 }
 } catch (e) { setError(message(e)); }
 finally { setBusy(false); }
 }
 return (
 <form onSubmit={submit} noValidate className="card max-w-sm mx-auto mt-12">
 <h1>{register ? 'Registro' : 'Iniciar sesión'}</h1>
 {register && (
 <label>Nombre
 <input value={name} onChange={e => setName(e.target.value)} />
 </label>
 )}
 <label>Correo
 <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
 </label>
 <label>Contraseña
 <input type="password" value={password}
 onChange={e => setPassword(e.target.value)} />
 </label>
 {error && <p className="text-red-700">{error}</p>}
 <button className="w-full mt-4" disabled={busy}>
 {busy ? 'Enviando...' : register ? 'Registrar' : 'Ingresar'}
 </button>
 <p className="text-center mt-3">
 <Link to={register ? '/login' : '/register'}>
 {register ? 'Ir al login' : 'Crear cuenta'}
 </Link>
 </p>
 </form>
 );
}