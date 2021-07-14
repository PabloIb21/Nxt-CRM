import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

const Producto = ({producto}) => {
  const { nombre, precio, existencia, id } = producto;

  // Mutation para eliminar productos
  const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      // obtener una copia del objeto de cache
      const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter( productoActual => productoActual.id !== id )
        }
      });
    }
  });

  // Elimina un producto
  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: '¿Deseas eliminar este producto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Eliminar por ID
          const { data } = await eliminarProducto({
            variables: {
              id
            }
          });

          // Mostrar una alerta
          Swal.fire(
            'Eliminado',
            data.eliminarProducto,
            'success'
          )
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

  const editarProducto = () => {
    Router.push({
      pathname: '/editarproducto/[id]',
      query: { id }
    });
  }

  return (
    <tr>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">$ {precio}</td>
      <td className="border px-4 py-2">{existencia} Piezas</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => editarProducto()}
          type="button"
          className="flex justify-center items-center bg-yellow-500 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
        >
          Editar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          onClick={() => confirmarEliminarProducto()}
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
        >
          Eliminar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Producto;