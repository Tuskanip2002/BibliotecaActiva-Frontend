import { Link } from 'react-router-dom';
import type { Resource } from '../types';

export function ResourceCard({ room }: { room: Resource }) {
  return (
    <li className="card">
      <h2>
        <Link to={`/rooms/${room.id}`}>
          {room.title}
        </Link>
      </h2>
      <p>Autor: {room.author}</p>
      <p>Categoría: {room.category}</p>
      <p>Ejemplares disponibles: {room.availableCopies}</p>
    </li>
  );
}