import React from 'react';
import { useParams } from 'react-router-dom';
import PublicMenu from '../components/PublicMenu';

const ClienteMenu = () => {
  const { clienteId } = useParams();

  return (
    <div>
      {/* En el futuro, podrías usar el ID para traer data del cliente */}
      <PublicMenu clienteId={clienteId} />
    </div>
  );
};

export default ClienteMenu;
