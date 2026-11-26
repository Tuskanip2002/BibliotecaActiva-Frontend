import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, message, conflict } from '../api';
import type { Resource, Operation } from '../types';
import { useQuery } from '../hooks/useQuery';
import { QueryStatus } from '../components/QueryStatus';

export function ResourceDetail() {
  const { id } = useParams();

  const { data: room, loading, error, reload } =
    useQuery<Resource>(`/materials/${id}`);

  const [value, setValue] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError('');
    setInfo('');

    const days = Number(value);

    if (!value.trim() || !Number.isInteger(days)
        || days < 1 || days > 7) {
      setFieldError('Ingresa un entero entre 1 y 7');
      return;
    }

    if (!room || room.availableCopies <= 0 || busy || loading)
      return;

    setBusy(true);

    try {
      const r = await api.post<Operation>(
        `/materials/${id}/loans`,
        { days }
      );

      setInfo(`Préstamo #${r.data.id} confirmado`);
      setValue('');
      reload();

    } catch (e) {
      if (conflict(e, 'NO_COPIES')) {
        setInfo('El material ya no tiene ejemplares disponibles.');
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
      <Link to="/dashboard">Volver al dashboard</Link>

      <QueryStatus
        loading={loading}
        error={error}
        onRetry={reload}
      />

      {info && <p role="status">{info}</p>}

      {!loading && !error && room && (
        <section className="card mt-3 space-y-2">
          <h1>{room.title}</h1>
          <p>{room.description}</p>
          <p>Autor: {room.author}</p>
          <p>Categoría: {room.category}</p>
          <p>Ejemplares disponibles: {room.availableCopies}</p>

          {room.availableCopies <= 0 && (
            <p>No hay ejemplares disponibles.</p>
          )}

          <form
            onSubmit={submit}
            noValidate
            className="max-w-sm mt-4"
          >
            <label>
              Días de préstamo
              <input
                type="number"
                min={1}
                max={7}
                step={1}
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            </label>

            {fieldError && (
              <p className="text-red-700">{fieldError}</p>
            )}

            <button
              className="mt-3"
              disabled={busy || room.availableCopies <= 0}
            >
              {busy ? 'Enviando...' : 'Solicitar préstamo'}
            </button>
          </form>
        </section>
      )}
    </>
  );
}