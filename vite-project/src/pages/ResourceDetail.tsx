import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, message, conflict } from '../api';
import type { Resource, Operation } from '../types';
import { useQuery } from '../hooks/useQuery';
import { QueryStatus } from '../components/QueryStatus';
export function ResourceDetail() {
 const { id } = useParams();
 const { data: room, loading, error, reload } = useQuery<Resource>(`/rooms/${id}`);
 const [value, setValue] = useState('');
 const [fieldError, setFieldError] = useState('');
 const [info, setInfo] = useState('');
 const [busy, setBusy] = useState(false);
 async function submit(e: FormEvent<HTMLFormElement>) {
 e.preventDefault(); setFieldError(''); setInfo('');
 const attendees = Number(value);
 if (!value.trim() || !Number.isInteger(attendees) || attendees < 1 || attendees > 6) {
 setFieldError('Ingresa un entero entre 1 y 6'); return;
 }
 if (!room || room.availableSlots <= 0 || busy || loading) return;
 setBusy(true);
 try {
 const r = await api.post<Operation>(`/rooms/${id}/bookings`, { attendees });
 setInfo(`Reserva #${r.data.id} confirmada`); setValue(''); reload();
 } catch (e) {
 if (conflict(e, 'NO_SLOTS')) {
 setInfo('La sala ya no tiene turnos disponibles.'); reload();
 } else setInfo(message(e));
 } finally { setBusy(false); }
 }
 return (
 <>
 <Link to="/dashboard">Volver al dashboard</Link>
 <QueryStatus loading={loading} error={error} onRetry={reload} />
 {info && <p role="status">{info}</p>}
 {!loading && !error && room && (
 <section className="card mt-3 space-y-2">
 <h1>{room.name}</h1>
 <p>{room.description}</p>
 <p>Edificio: {room.building} | Piso: {room.floor}</p>
 <p>Turnos disponibles: {room.availableSlots}</p>
 {room.availableSlots <= 0 && <p>No hay turnos disponibles.</p>}
 <form onSubmit={submit} noValidate className="max-w-sm mt-4">
 <label>Número de asistentes
 <input type="number" min={1} max={6} step={1}
 value={value} onChange={e => setValue(e.target.value)} />
 </label>
 {fieldError && <p className="text-red-700">{fieldError}</p>}
 <button className="mt-3" disabled={busy || room.availableSlots <= 0}>
 Reservar
 </button>
 </form>
 </section>
 )}
 </>
 );
}
