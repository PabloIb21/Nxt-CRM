import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  // State para el mensaje
  const [mensaje, setMensaje] = useState(null);

  // Mutation para crear nuevos usuarios
  const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

  // Routing
  const router = useRouter();

  // Validación del formulario
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El email no es válido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('El password es obligatorio')
    }),
    onSubmit: async valores => {
      const { email, password } = valores;

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password
            }
          }
        });
        setMensaje('Autenticando...');

        setTimeout(() => {
          // Guardar el token en localStorage
          const { token } = data.autenticarUsuario;
          localStorage.setItem('token', token);
        }, 1000);

        // Redireccionar hacia clientes
        setTimeout(() => {
          setMensaje(null);
          router.push('/');
        }, 2000);
      } catch (error) {
        setMensaje(error.message.replace('GraphQL error: ', ''));
        
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
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

        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email Usuario"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.email && formik.errors.email ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null }

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password Usuario"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              { formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null }

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase cursor-pointer hover:bg-gray-900"
                value="Iniciar Sesión"
              />

              <Link href="/nuevacuenta">
                <a className="mt-5 block text-gray-600">
                  Obtener Cuenta
                </a>
              </Link>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;