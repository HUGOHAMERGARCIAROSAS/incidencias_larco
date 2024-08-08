import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";

import store from "./redux/store";
import ProtectedRoute from "./routes/ProtectedRoute";

import ErrorBoundary from './pages/ErrorBoundary';


const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/home/Dashboard'));
const Register = lazy(() => import('./pages/auth/Register'));
const MisDatos = lazy(() => import('./pages/home/MisDatos'));
const Inicidencias = lazy(() => import('./pages/home/Inicidencias'));
const IncidenciasTodas = lazy(() => import('./pages/home/IncidenciasTodas'));
const MisAutos = lazy(() => import('./pages/home/MisAutos'));
const MyQr = lazy(() => import('./pages/home/MyQr'));
const IncidenciaCreate = lazy(() => import('./pages/home/IncidenciaCreate'));
const MiUtilidad = lazy(() => import('./pages/home/MiUtilidad'));
const Calificar = lazy(() => import('./pages/Calificar'));
const Exito = lazy(() => import('./pages/Exito'));


function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/calificar/:id" element={<Calificar />} />
              <Route path="/exito/:rating" element={<Exito />} />
              <Route path="*" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mis-autos" element={<MisAutos />} />
                <Route path="/mis-datos" element={<MisDatos />} />
                <Route path="/mis-incidencias" element={<Inicidencias />} />
                <Route path="/todas-las-incidencias" element={<IncidenciasTodas />} />
                <Route path="/incidencias/create" element={<IncidenciaCreate />} />
                <Route path="/mi_utilidad" element={<MiUtilidad />} />
                <Route path="/miqr" element={<MyQr />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
}

export default App;
