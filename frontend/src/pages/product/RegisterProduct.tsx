import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { Link } from 'react-router-dom';
import { RegisterFormProduct, registerProductSchema } from '../../validations/ProductSchema';
import { registerProduct } from '../../services/api/product/Product';
import InputPrice from '../../components/input-price/InputPrice';
import { user } from '../../services/api/auth/Authorization';
import Layout from '../../components/laytouts/LaytoutAdmin';

const RegisterProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm<RegisterFormProduct>({
        resolver: zodResolver(registerProductSchema),
    });

    const getUserId = async () => {
        const userId = await user();

        if (!userId) {
            setError('Faça o longin novamente');
            return;
        }
        setValue('userId', userId);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const onSubmit = async (data: RegisterFormProduct) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await registerProduct(data);
            if (response.preco) {
                setSuccess(true);
                setTimeout(() => {
                    navigate(0);
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
        <Layout title={'Registrar Produto'} >
            <div className="flex items-center justify-center min-h-screen">
                {loading ? (
                    <Loader height={50} />
                ) : (
                    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Produto</h2>
                        {error && <FlashMessage message={error} success={false} />}
                        {success && <FlashMessage message={'Salvo com sucesso'} success={true} />}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    {...register('nome', { required: 'Este campo é obrigatório' })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                                />
                                {errors.nome && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Descrição</label>
                                <input
                                    type="text"
                                    {...register('descricao')}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                                />
                                {errors.descricao && (
                                    <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700">Preço</label>
                                <InputPrice
                                    name="preco"
                                    control={control}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                                />
                                {errors.preco && (
                                    <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700">Quantidade</label>
                                <input
                                    type="number"
                                    {...register('estoque', { required: 'Este campo é obrigatório' })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"

                                />
                                {errors.estoque && (
                                    <p className="text-red-500 text-sm mt-1">{errors.estoque.message}</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <input
                                    type="hidden"
                                    {...register('userId')}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
                            >
                                Cadastrar
                            </button>
                        </form>
                        <div className="w-full text-center mt-4">
                            <Link to="/produtos" >
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
                                >
                                    Voltar
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RegisterProduct;

