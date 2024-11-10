import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { RegisterFormData, registerSchema } from '../../validations/RegisterSchema';
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { registerUserAdmin } from '../../services/api/auth/Auth';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';

const RegisterUserAdmin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await registerUserAdmin(data);
            if (response.email) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 500);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Ocorreu um erro ao tentar realizar o cadastro.');
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
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Cadastro</h2>
                    {error && <FlashMessage message={error} success={false} />}
                    {success && <FlashMessage message={'Salvo com sucesso'} success={true} />}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nome</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Este campo é obrigatório' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Este campo é obrigatório' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700">CPF</label>
                            <InputMask
                                mask="999.999.999-99"
                                {...register('cpf', { required: 'Este campo é obrigatório' })}
                            >
                                {(inputProps: any) => (
                                    <input
                                        {...inputProps}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                                    />
                                )}
                            </InputMask>
                            {errors.cpf && (
                                <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
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
                        <div className="mb-6">
                            <label className="block text-gray-700">Confirmar Senha</label>
                            <input
                                type="password"
                                {...register('confirmPassword', { required: 'Este campo é obrigatório' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Cadastrar
                        </button>
                    </form>
                    <div className="w-full text-center mt-4">
                        <Link to="/login" className="text-blue-500 hover:text-blue-700">
                            Voltar
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterUserAdmin;
