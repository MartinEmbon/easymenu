import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeneralInfo = ({ email, clienteId }) => {
  const [info, setInfo] = useState({
    address: '',
    email:'',
    phone: '',
    instagram: '',
    facebook:'',
    hours: {
      lunes: '',
      martes: '',
      miercoles: '',
      jueves: '',
      viernes: '',
      sabado: '',
      domingo: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const endpointBase = 'https://get-general-info-336444799661.us-central1.run.app'; // replace with your deployed cloud function URL

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${endpointBase}/getGeneralInfo`, {
          params: { clienteId },
        });
        if (response.data.generalInfo) {
          setInfo(response.data.generalInfo);
        }
      } catch (error) {
        console.error('Error fetching general info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      fetchInfo();
    }
  }, [clienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in info.hours) {
      setInfo((prev) => ({
        ...prev,
        hours: { ...prev.hours, [name]: value },
      }));
    } else {
      setInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`https://general-info-336444799661.us-central1.run.app/saveGeneralInfo`, {
        clienteId,
        generalInfo: info,
      });
      setSuccess('✅ Información guardada con éxito');
    } catch (error) {
      console.error('Error saving general info:', error);
      setSuccess('❌ Error al guardar la información');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Información General</h2>

      {loading && <p>Cargando...</p>}
      {success && <p>{success}</p>}

      <label>Dirección:</label>
      <input type="text" name="address" value={info.address} onChange={handleChange} className="edit-input" />

      <label>Teléfono:</label>
      <input type="text" name="phone" value={info.phone} onChange={handleChange} className="edit-input" />

      <label>Email:</label>
      <input type="email" name="email" value={info.email} onChange={handleChange} className="edit-input" />

      <label>Instagram:</label>
      <input type="text" name="instagram" value={info.instagram} onChange={handleChange} className="edit-input" />

      <label>Facebook:</label>
      <input type="text" name="facebook" value={info.facebook} onChange={handleChange} className="edit-input" />

      <h3>Horarios de Atención</h3>
      {Object.keys(info.hours).map((day) => (
        <div key={day}>
          <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
          <input
            type="text"
            name={day}
            value={info.hours[day]}
            onChange={handleChange}
            className="edit-input"
            placeholder="Ej: 9:00 - 18:00"
          />
        </div>
      ))}

      <button className="save-button" onClick={handleSave}>Guardar Información</button>
    </div>
  );
};

export default GeneralInfo;
