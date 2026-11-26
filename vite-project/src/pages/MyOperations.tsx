import { useState } from 'react';
import { api, message, conflict } from '../api';
import type { Operation } from '../types';
import { useQuery } from '../hooks/useQuery';
import { QueryStatus } from '../components/QueryStatus';
export function MyOperations() {
 const { data, loading, error, reload } = useQuery<Operation[]>('/me/bookings');
 const [busy, setBusy] = useState(false);
 const [info, setInfo] = useState('');
 async function cancel(b: Operation) {
 if (busy || loading || b.status !== 'ACTIVE') return;
 if (!window.confirm('¿Cancelar esta reserva?')) return;
 setBusy(true); setInfo('');
 try {
 await api.patch(`/bookings/${b.id}/cancel`);
 setInfo('Reserva cancelada. Se liberó un turno.'); reload();
 } catch (e) {
 if (conflict(e, 'INVALID_STATE')) {
 setInfo('La reserva cambió de estado.'); reload();
 } else setInfo(message(e));
 } finally { setBusy(false); }
 }
 return (
 <>
 <h1>Mis reservas</h1>
 <QueryStatus loading={loading} error={error} onRetry={reload} />
 {info && <p role="status">{info}</p>}
 {!loading && !error && data && (
 data.length === 0 ? <p>No tienes reservas.</p> : (
 <ul>
 {data.map(b => (
 <li key={b.id} className="card my-3">
 <p className="font-semibold">Reserva #{b.id} - {b.resourceName}</p>
 <p>Asistentes: {b.attendees} | Estado: {b.status}</p>
 {b.status === 'ACTIVE' && (
 <button className="danger mt-2" disabled={busy}
 onClick={() => cancel(b)}>Cancelar</button>
 )}
 </li>
 ))}
 </ul>
 )
 )}
 </>
 );
}