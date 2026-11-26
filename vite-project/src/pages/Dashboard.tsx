import { useState } from 'react';
import type { Page, Resource } from '../types';
import { useQuery } from '../hooks/useQuery';
import { QueryStatus } from '../components/QueryStatus';
import { ResourceCard } from '../components/ResourceCard';
export function Dashboard() {
 const [page, setPage] = useState(1);
 const { data, loading, error, reload } = useQuery<Page<Resource>>(`/rooms?page=${page}&size=5`);
 const pending = loading || (!!data && data.page !== page && !error);
 return (
 <>
 <h1>Salas de estudio</h1>
 <QueryStatus loading={pending} error={error} onRetry={reload} />
 {!pending && !error && data && (
 <>
 {data.items.length === 0 ? <p>No hay salas.</p> : (
 <ul className="grid gap-3 sm:grid-cols-2 mb-4">
 {data.items.map(room => <ResourceCard key={room.id} room={room} />)}
 </ul>
 )}
 <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
 <span className="mx-2">Página {data.totalPages === 0 ? 0 : page} de {data.totalPages}</span>
 <button disabled={page >= data.totalPages}
 onClick={() => setPage(page + 1)}>Siguiente</button>
 </>
 )}
 </>
 );
}
