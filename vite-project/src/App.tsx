import {
  BrowserRouter, Routes, Route, Navigate,
  Outlet, Link, useNavigate
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthForm } from './pages/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { ResourceDetail } from './pages/ResourceDetail';
import { MyOperations } from './pages/MyOperations';

function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex flex-wrap gap-4 items-center bg-slate-200 rounded-lg p-4 mb-6">

        <strong className="mr-auto text-xl">
          BibliotecaActiva
        </strong>

        <Link to="/dashboard">Materiales</Link>
        <Link to="/my-loans">Mis préstamos</Link>

        <button
          className="secondary"
          onClick={() => {
            signOut();
            navigate('/login', { replace: true });
          }}
        >
          Salir
        </button>

      </nav>

      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="max-w-3xl mx-auto p-4">
          <Routes>

            <Route path="/register"
              element={<AuthForm key="register" register={true} />}
            />

            <Route path="/login"
              element={<AuthForm key="login" register={false} />}
            />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>

                <Route path="/dashboard"
                  element={<Dashboard />}
                />

                <Route path="/materials/:id"
                  element={<ResourceDetail />}
                />

                <Route path="/my-loans"
                  element={<MyOperations />}
                />

              </Route>
            </Route>

            <Route path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="*"
              element={<p>Página no encontrada</p>}
            />

          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}