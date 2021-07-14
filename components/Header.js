import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
  query obtenerUsuario{
    obtenerUsuario {
      nombre
    }
  }
`;

const Header = () => {

  const router = useRouter();

  // Query de Apollo
  const { data, loading, client } = useQuery(OBTENER_USUARIO);
  
  if(loading) return 'Cargando...';

  // Si no hay información
  if(!data.obtenerUsuario) {
    return router.push('/login');
  }

  const { nombre } = data.obtenerUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    client.clearStore();
    router.push('/login');
  }

  return (
    <div className="sm:flex justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">Hola: {nombre}</p>
      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-800 py-2 px-4 w-full sm:w-auto font-bold uppercase text-xs rounded text-white shadow-md"
      >Cerrar Sesión</button>
    </div>
  );
};

export default Header;