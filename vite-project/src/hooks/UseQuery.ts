import { useEffect, useState } from 'react';
import { api, message } from '../api';
export function useQuery<T>(path: string) {
 const [data, setData] = useState<T | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [version, setVersion] = useState(0);
 function reload() {
 setLoading(true);
 setVersion(v => v + 1);
 }
 useEffect(() => {
 let cancelled = false;
 setLoading(true); setError('');
 api.get<T>(path)
 .then(r => { if (!cancelled) setData(r.data); })
 .catch(e => { if (!cancelled) setError(message(e)); })
 .finally(() => { if (!cancelled) setLoading(false); });
 return () => { cancelled = true; };
 }, [path, version]);
 return { data, loading, error, reload };
}