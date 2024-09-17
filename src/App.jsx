import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";

import store from "./redux/store";
import ProtectedRoute from "./routes/ProtectedRoute";

import ErrorBoundary from './pages/ErrorBoundary';


const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/home/Dashboard'));
// const Register = lazy(() => import('./pages/auth/Register'));
const MisDatos = lazy(() => import('./pages/home/MisDatos'));
const Pacientes = lazy(() => import('./pages/home/Pacientes'));
const MiCita = lazy(() => import('./pages/home/MiCita'));
const PacientesCreate = lazy(() => import('./pages/home/PacientesCreate'));
const CitasTodas = lazy(() => import('./pages/home/CitasTodas'));
const RecetaMedica = lazy(() => import('./pages/home/RecetaMedica'));


function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="*" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mi-cita" element={<MiCita />} />
                <Route path="/mis-datos" element={<MisDatos />} />
                <Route path="/mis-pacientes" element={<Pacientes />} />
                <Route path="/citas_todas" element={<CitasTodas />} />
                <Route path="/pacientes/create" element={<PacientesCreate />} />
                <Route path="/receta_medica/:id" element={<RecetaMedica />} />
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
