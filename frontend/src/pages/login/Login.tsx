import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, loginSchema } from '../../validations/LoginSchema';
import { login } from '../../services/api/auth/Auth';
import Loader from '../../components/loader/Loader';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await login(data);
            if (response?.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {loading ? (
                <Loader height={50} />
            ) : (
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="text"
                                {...register('email', { required: 'Este campo é obrigatório' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700">Senha</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Este campo é obrigatório' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;
