interface Props {
 loading: boolean;
 error: string;
 onRetry: () => void;
}
export function QueryStatus({ loading, error, onRetry }: Props) {
 if (loading) return <p>Cargando...</p>;
 if (error) return (
 <div>
 <p className="text-red-700">{error}</p>
 <button onClick={onRetry}>Reintentar</button>
 </div>
 );
 return null;
}