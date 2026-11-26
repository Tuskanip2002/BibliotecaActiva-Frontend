import { Link } from 'react-router-dom';
import type { Resource } from '../types';
export function ResourceCard({ room }: { room: Resource }) {
 return (
 <li className="card">
 <h2><Link to={`/rooms/${room.id}`}>{room.name}</Link></h2>
 <p>Autor: {room.author} | Categoría: {room.category}</p>
 <p className="mt-2 font-semibold">Turnos disponibles: {room.availableSlots}</p>
 </li>
 );
}