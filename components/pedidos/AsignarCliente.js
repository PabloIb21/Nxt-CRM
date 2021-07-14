import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const AsignarCliente = () => {
  const [cliente, setCliente] = useState([]);

  // Context de pedidos
  const { agregarCliente } = useContext(PedidoContext);

  // Consultar la BD
  const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const seleccionarCliente = cliente => {
    setCliente(cliente);
  }

  if(loading) return 'Cargando...';

  const { obtenerClientesVendedor } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>

      <Select 
        className="mt-3"
        options={obtenerClientesVendedor}
        onChange={ opcion => seleccionarCliente(opcion) }
        getOptionValue={ opciones => opciones.id }
        getOptionLabel={ opciones => opciones.nombre }
        placeholder="Busque o seleccione el cliente"
        noOptionsMessage={ () => 'No hay resultados' }
      />
    </>
  );
};

export default AsignarCliente;