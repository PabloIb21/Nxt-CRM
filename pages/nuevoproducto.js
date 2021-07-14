import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      precio
      existencia
    }
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

const NuevoProducto = () => {
  // State para el mensaje
  const [mensaje, setMensaje] = useState(null);

  const router = useRouter();

  // Mutation de apollo 
  const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
    update(cache, { data: { nuevoProducto }}) {
      // obtener el objeto de cache
      const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

      // reescribir ese objeto
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto]
        }
      });
    }
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      precio: '',
      existencia: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required('El nombre del producto es obligatorio'),
      precio: Yup.number()
        .required('El precio del producto es obligatorio')
        .positive('No se aceptan números negativos'),
      existencia: Yup.number()
        .required('Agrega la cantidad disponible')
        .positive('No se aceptan números negativos')
        .integer('La cantidad deben ser números enteros')
    }),
    onSubmit: async valores => {
      const { nombre, precio, existencia } = valores;

      try {
        await nuevoProducto({
          variables: {
            input: {
              nombre,
              precio,
              existencia
            }
          }
        });

        // Mostrar una alerta
        Swal.fire(
          'Creado',
          'Se creó el producto correctamente',
          'success'
        );

        router.push('/productos'); // Redireccionar a productos
      } catch (error) {
        console.log(error);
        setMensaje(error.message.replace('GraphQL error: ', ''));

        setTimeout(() => {
          setMensaje(null);
        }, 2000);
      }
    }
  });

  const mostrarMensaje = () => {
    return(
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  }

  return (
    <>
      <Layout>
        { mensaje && mostrarMensaje() }

        <h1 className="sm:text-center text-2xl text-gray-800 font-light">Nuevo Producto</h1>
      
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  placeholder="Nombre Producto"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.nombre && formik.errors.nombre ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.nombre}</p>
                  </div>
                ) : null }

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                  Precio
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="precio"
                  type="number"
                  placeholder="Precio Producto"
                  value={formik.values.precio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.precio && formik.errors.precio ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.precio}</p>
                  </div>
                ) : null }

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                  Cantidad
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="existencia"
                  type="number"
                  placeholder="Cantidad Producto"
                  value={formik.values.existencia}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.existencia && formik.errors.existencia ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.existencia}</p>
                  </div>
                ) : null }

              <input 
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                value="Registrar Producto"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevoProducto;