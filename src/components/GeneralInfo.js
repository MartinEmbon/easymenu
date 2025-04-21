import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../GeneralInfo.css"
import { useOutletContext } from 'react-router-dom';

const GeneralInfo = () => {
  const [info, setInfo] = useState({
    address: '',
    profilePictureUrl: '', // 👈 Add this line
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
  const { email, clienteId } = useOutletContext();

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setLoading(true);
      const imageUrl = await uploadImageToGCS(file);
  
      const updatedInfo = {
        ...info,
        profilePictureUrl: imageUrl,
      };
  
      setInfo(updatedInfo);
  
      // Save to Firestore
      await axios.put(`https://general-info-336444799661.us-central1.run.app/saveGeneralInfo`, {
        clienteId,
        generalInfo: updatedInfo,
      });
  
      setSuccess('✅ Imagen subida y guardada con éxito');
    } catch (error) {
      console.error('Error uploading image:', error);
      setSuccess('❌ Error al subir la imagen');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 4000);
    }
  };
  

  const uploadImageToGCS = async (file) => {
    try {
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/add-cover-photo-album",
        {
          filename: file.name,
          contentType: file.type,
        }
      );
      const { uploadUrl, publicUrl } = response.data;
  
      const uploadResponse = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
  
      if (uploadResponse.status === 200) {
        return publicUrl;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  

  return (
    <div className="general-info-container">
      <h2 className="general-info-form-title">Información General</h2>
  
      {loading && <p className="general-info-message">Cargando...</p>}
      {success && <p className={`general-info-message ${success.includes('Error') ? 'general-info-error' : 'general-info-success'}`}>{success}</p>}
  
      <label className="general-info-label">Foto de perfil del restaurante:</label>
<input
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="general-info-input"
/>

{/* Optional preview */}
{info.profilePictureUrl && (
  <img
    src={info.profilePictureUrl}
    alt="Imagen de perfil"
    style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }}
  />
)}


<label className="general-info-label">Dirección:</label>
      <input
        type="text"
        name="address"
        value={info.address}
        onChange={handleChange}
        className="general-info-input"
      />
  
      <label className="general-info-label">Teléfono:</label>
      <input
        type="text"
        name="phone"
        value={info.phone}
        onChange={handleChange}
        className="general-info-input"
      />
  
      <label className="general-info-label">Email:</label>
      <input
        type="email"
        name="email"
        value={info.email}
        onChange={handleChange}
        className="general-info-input"
      />
  
      <label className="general-info-label">Instagram:</label>
      <input
        type="text"
        name="instagram"
        value={info.instagram}
        onChange={handleChange}
        className="general-info-input"
      />
  
      <label className="general-info-label">Facebook:</label>
      <input
        type="text"
        name="facebook"
        value={info.facebook}
        onChange={handleChange}
        className="general-info-input"
      />
  
      <h3>Horarios de Atención</h3>
      
      {['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].map((day) => (
  <div key={day}>
    <label className="general-info-label">
      {day.charAt(0).toUpperCase() + day.slice(1)}:
    </label>
    <input
      type="text"
      name={day}
      value={info.hours?.[day] ?? ''}
      onChange={handleChange}
      className="general-info-input"
      placeholder="Ej: 9:00 - 18:00"
    />
  </div>
))}

  
      <button
        className="general-info-save-button"
        onClick={handleSave}
      >
        Guardar Información
      </button>
    </div>
  );
};

export default GeneralInfo;
