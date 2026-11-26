import { useState } from 'react';
import { api, message, conflict } from '../api';
import type { Operation } from '../types';
import { useQuery } from '../hooks/useQuery';
import { QueryStatus } from '../components/QueryStatus';

export function MyOperations() {
  const { data, loading, error, reload } =
    useQuery<Operation[]>('/me/loans');

  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');

  async function returnLoan(b: Operation) {
    if (busy || loading || b.status !== 'ACTIVE')
      return;

    if (!window.confirm('¿Devolver este préstamo?'))
      return;

    setBusy(true);
    setInfo('');

    try {
      await api.patch(`/loans/${b.id}/return`);

      setInfo('Préstamo devuelto correctamente.');
      reload();

    } catch (e) {
      if (conflict(e, 'INVALID_STATE')) {
        setInfo('El préstamo ya no está activo.');
        reload();
      } else {
        setInfo(message(e));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Mis préstamos</h1>

      <QueryStatus
        loading={loading}
        error={error}
        onRetry={reload}
      />

      {info && <p role="status">{info}</p>}

      {!loading && !error && data && (
        data.length === 0 ? (
          <p>No tienes préstamos.</p>
        ) : (
          <ul>
            {data.map(b => (
              <li key={b.id} className="card my-3">

                <p className="font-semibold">
                  Préstamo #{b.id} - {b.resourceName}
                </p>

                <p>Días: {b.days}</p>
                <p>Estado: {b.status}</p>

                {b.status === 'ACTIVE' && (
                  <button
                    className="danger mt-2"
                    disabled={busy}
                    onClick={() => returnLoan(b)}
                  >
                    Devolver
                  </button>
                )}

              </li>
            ))}
          </ul>
        )
      )}
    </>
  );
}