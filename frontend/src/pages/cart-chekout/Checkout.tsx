import { useEffect, useState } from "react";
import { CartItem } from "../../types/Cart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { formatMoney, totalCart } from '../../services/utils/helpers';
import { getCart, orderSave } from "../../services/api/cart/Cart";
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import { RegisterClientFormData, registerClientSchema } from "../../validations/RegisterClientSchema";

const Checkout = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterClientFormData>({
        resolver: zodResolver(registerClientSchema),
    });

    const populateCart = async () => {
        try {
            setLoading(true);
            const response = await getCart();
            if (response.items) {
                setCartItems(response.items);
            }
        } catch (error) {
            setError('erro')
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        populateCart();
    }, []);

    const onSubmit = async (data: RegisterClientFormData) => {
        completePurchase(data,)
    };

    const total = totalCart(cartItems);

    const removeItem = (index: number) => {
        const newCartItems = [...cartItems];
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
    };

    const completePurchase = async (client: RegisterClientFormData) => {
        setSuccess(null);
        setLoading(true);
        setError(null);
        try {
            await orderSave(client);
            setValue("nome", '');
            setValue("email", '');
            setValue("cpf", '');
            await populateCart();
            setSuccess(true);
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
        <>
            {loading ? (
                <Loader height={50} />
            ) : (

                <><div className="p-6 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-500 text-center mb-4">Checkout</h1>
                    <table className="min-w-full bg-white border border-gray-200 mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border-b text-gray-500">Produto</th>
                                <th className="px-4 py-2 border-b text-gray-500">Quantidade</th>
                                <th className="px-4 py-2 border-b text-gray-500">Preço</th>
                                <th className="px-4 py-2 border-b text-gray-500">Total</th>
                                <th className="px-4 py-2 border-b text-gray-500"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {cartItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-2 px-4 text-center text-gray-700">
                                        Seu carrinho está vazio
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {
                                        cartItems.map((item) => (
                                            <tr key={item.productId}>
                                                <td className="px-4 py-2 border-b text-center text-gray-500">{item.name}</td>
                                                <td className="px-4 py-2 border-b text-center text-gray-500">{item.qtty}</td>
                                                <td className="px-4 py-2 border-b text-center text-gray-500">{formatMoney(item.price)}</td>
                                                <td className="px-4 py-2 border-b text-center text-gray-500">{formatMoney(item.totalPrice)}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <button
                                                        className="text-red-500 bg-blue-50 bg-opacity-50 hover:text-red-700 transition duration-200"
                                                        title="Excluir"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </>
                            )}
                        </tbody>
                    </table>

                    <div className=" mt-4 mb-4 text-xl font-semibold text-gray-500">
                        <p>Total: {formatMoney(total)}</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="w-full">
                            <h2 className="font-bold text-center text-gray-500 mb-6">Informe seus dados</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        {...register('nome', { required: 'Este campo é obrigatório' })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600" />
                                    {errors.nome && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                                    )}
                                </div>
                                <div className="flex mb-6 space-x-4">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">E-mail</label>
                                        <input
                                            type="email"
                                            {...register('email', { required: 'Este campo é obrigatório' })}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600" />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">CPF</label>
                                        <InputMask
                                            mask="999.999.999-99"
                                            {...register('cpf', { required: 'Este campo é obrigatório' })}>
                                            {(inputProps: any) => (
                                                <input
                                                    {...inputProps}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600" />
                                            )}
                                        </InputMask>
                                        {errors.cpf && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    {error && <FlashMessage message={error} success={false} />}
                                    {success && <FlashMessage message={'Compra realizada com sucesso'} success={true} />}
                                </div>
                                <button
                                    className={`py-2 px-4 text-white rounded-md transition duration-200 ${cartItems.length === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-700"}`}
                                    disabled={cartItems.length === 0}
                                >
                                    Finalizar Compra
                                </button>

                                <Link to="/">
                                    <button
                                        type="button"
                                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Continuar comprando
                                    </button>
                                </Link>
                                <Link to="/login">
                                    <button
                                        type="button"
                                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Ver suas compras
                                    </button>
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
                </>
            )}
        </>
    );
};

export default Checkout;
