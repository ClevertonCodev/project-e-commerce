import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, loginSchema } from '../../validations/LoginSchema';
import { login } from '../../services/api/auth/Auth';
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(data);
            if (response?.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Ocorreu um erro ao tentar fazer login.');
            }
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
                    {error && <FlashMessage message={error} success={false} />}
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
                                placeholder='Para ver suas revervas, a senha é seu cpf'
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
                        <Link to="/">
                            <button
                                className={`w-full mt-4 py-2 px-4 text-white rounded-md transition duration-200 bg-blue-500 hover:bg-blue-600`}
                            >
                                Área compras
                            </button>
                        </Link>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Ainda não tem uma conta?</p>
                        <Link to="/register-user" className="text-blue-500 hover:text-blue-700">
                            Registre-se aqui
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
