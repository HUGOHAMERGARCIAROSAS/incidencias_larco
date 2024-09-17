import React, { useState } from 'react';
import { FaRegSave, FaRegTrashAlt, FaUserPlus } from "react-icons/fa";

import MyModal from '../home/MyModal';

const CitaForm = ({ loading, handleChange, handleSubmit, pacientes, handleChangeDetalle, handleSubmitCitaDetalle, detalleCitas, datosDetalle, setDetalleCitas, datos }) => {

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="form-container">
      <h2>REGISTRAR CITA</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            onChange={handleChange}
            value={datos.fecha}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="id_paciente">Paciente</label>
          <div style={{ width: '78%', display: 'inline-block', marginRight: '2%' }}>
            <select
              name="id_paciente"
              id="id_paciente"
              onChange={handleChange}
              value={datos.id_paciente}
              required
            >
              <option value="">Selecciona un Paciente</option>
              {pacientes?.map((item, index) => (
                <option key={index} value={item.id_paciente}>
                  {item.nombres}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: '20%', display: 'inline-block' }}>
            <button className="btn btn-primary" type="button" onClick={handleOpenModal}>
              <FaUserPlus className="icons-length" />
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="peso">Peso</label>
          <input
            type="text"
            id="peso"
            name="peso"
            placeholder="Ingresa tu peso"
            value={datos.peso}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="talla">Talla</label>
          <input
            type="text"
            id="talla"
            name="talla"
            placeholder="Ingresa tu talla"
            value={datos.talla}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="indicaciones">Indicaciones</label>
          <textarea
            style={{ height: '100px', fontSize: '18px' }}
            type="text"
            id="indicaciones"
            name="indicaciones"
            placeholder="Ingresa tu indicaciones"
            value={datos.indicaciones}
            onChange={handleChange}
            required
          />
        </div>

        <hr />

        <div className="form-group">
          <h4>Detalle Cita</h4>
        </div>

        <div className="form-group">
          <label htmlFor="medicamento">Medicamento</label>
          <input
            type="text"
            id="medicamento"
            name="medicamento"
            placeholder="Ingresa el medicamento"
            onChange={handleChangeDetalle}
            value={datosDetalle.medicamento}

          />
        </div>
        <div className="form-group">
          <label htmlFor="horario">Horario</label>
          <input
            type="text"
            id="horario"
            name="horario"
            placeholder="Ingresa el horario"
            onChange={handleChangeDetalle}
            value={datosDetalle.horario}

          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary" style={{ background: '#3b3687', borderColor: '#3b3687' }}
            onClick={handleSubmitCitaDetalle}>
            <FaRegSave className='icons-length' size={15} /> Registrar Detalle</button>
        </div>

        <hr />

        <div className="table-container">
          <table className="my-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicamento</th>
                <th>Horario</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {
                detalleCitas?.length === 0 ? (
                  <tr>
                    <td colSpan="4">No hay medicamentos agregados</td>
                  </tr>
                ) : detalleCitas?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.medicamento}</td>
                    <td>{item.horario}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ background: '#d9534f', borderColor: '#d9534f' }}
                        onClick={() => {
                          const newCitas = [...detalleCitas];
                          newCitas.splice(index, 1);
                          setDetalleCitas(newCitas);
                        }}
                      >
                        <FaRegTrashAlt className='icons-length' size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>

        <hr />

        <button type="submit">
          <FaRegSave className='icons-length' size={15} /> {loading ? "Registrando..." : "Registrar Cita"}
        </button>
      </form>

      <MyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
};

export default CitaForm;