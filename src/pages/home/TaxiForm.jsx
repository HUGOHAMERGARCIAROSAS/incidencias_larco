import React from 'react';
import { FaRegSave } from "react-icons/fa";

const TaxiForm = ({ datos, handleChange, handleSubmit, loading, empresas, message }) => (
  <div className="form-container">
    <h2>MI TAXI</h2>
    <div className="form-group">
      <p style={{ color: 'red' }}>{message}</p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="modelo">Modelo</label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          placeholder="Ingresa tu modelo"
          onChange={handleChange}
          value={datos?.modelo || ""}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          placeholder="Ingresa tu color"
          onChange={handleChange}
          value={datos?.color || ""}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="placa">Placa</label>
        <input
          type="text"
          id="placa"
          name="placa"
          placeholder="Ingresa tu placa"
          onChange={handleChange}
          value={datos?.placa || ""}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="idempresa">Empresa</label>
        <select
          name="idempresa"
          id="idempresa"
          onChange={handleChange}
          value={datos?.idempresa || ""}
          required
        >
          <option value="">Selecciona una empresa</option>
          {empresas.map((item, index) => (
            <option key={index} value={item.idempresa}>
              {item.nombre} - {item.ruc}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">
        <FaRegSave className='icons-length' size={15} /> {loading ? "Registrando..." : "Registrar"}
      </button>
    </form>
  </div>
);

export default TaxiForm;