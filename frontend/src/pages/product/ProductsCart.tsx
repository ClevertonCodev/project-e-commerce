import { useEffect, useState } from "react";
import { formatMoney } from "../../services/utils/helpers";
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { Link, useNavigate } from "react-router-dom";
import { ProductCart } from "../../types/Produto";
import { Payload } from "../../types/Cart";
import { findAll } from "../../services/api/product/Product";
import { addItemsCart } from "../../services/api/cart/Cart";

const ProductsCart = () => {
    const [cartItems, setCartItems] = useState<ProductCart[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [payload, setPayload] = useState<Payload>({ products: [] });;
    const navigate = useNavigate();
    const getProducts = async () => {
        try {
            const response = await findAll();
            if (response && response.length > 0) {
                const updatedProducts = response.map(product => ({
                    ...product,
                    qtty: 0
                }));
                setCartItems(updatedProducts);
            }
        } catch (error) {
            setError('Error no servidor, tente novamente mais tarde.')
        } finally {
            setLoading(false);
        }
    }
    const increaseQuantity = (item: ProductCart) => {
        setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem.id === item.id && cartItem.qtty < cartItem.estoque
                    ? { ...cartItem, qtty: cartItem.qtty + 1 }
                    : cartItem
            )
        );
    };

    const decreaseQuantity = (item: ProductCart) => {
        setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem.id === item.id && cartItem.qtty >= 1
                    ? { ...cartItem, qtty: cartItem.qtty - 1 }
                    : cartItem
            )
        );
    };

    const total = cartItems.reduce((acc, item) => acc + item.preco * item.qtty, 0);

    const checkout = () => {
        return cartItems
            .filter((item) => item.qtty > 0)
            .map((item) => ({
                productId: item.id,
                qtty: item.qtty,
            }));
    };

    const addCart = async () => {
        setLoading(true);
        try {
            const response = await addItemsCart(payload);
            if (response) {
                navigate('/carrinho');
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts()
    }, []);

    useEffect(() => {
        const products = checkout();
        setPayload({ products })
    }, [cartItems]);

    return (
        <div className="mt-4">
            {loading ? (
                <Loader height={50} />
            ) : (
                <><h1 className="text-2xl font-bold text-gray-500 text-center mb-4">Carrinho</h1><div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
                    {cartItems.length === 0 ? (
                        <>
                            <div className="text-center text-gray-500">
                                <p>Nenhum produto cadastrado</p>
                                <Link to="/register-produto">
                                    <button
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Adicionar Produtos
                                    </button>
                                </Link>
                            </div>
                            <div className='mt-2'>
                                {error && <FlashMessage message={error} success={false} />}
                            </div>
                        </>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-4 border-b">
                                    <div>
                                        <h3 className="text-lg text-gray-500 font-semibold">{item.nome}</h3>
                                        <p className="text-gray-500">{item.descricao}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => decreaseQuantity(item)}
                                                className="px-2 py-1 bg-gray-200 rounded-md text-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="mx-3 text-lg text-gray-500">{item.qtty}</span>
                                            <button
                                                onClick={() => increaseQuantity(item)}
                                                className={`px-2 py-1 rounded-md ${item.qtty >= item.estoque
                                                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white'}`}
                                                disabled={item.qtty >= item.estoque}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-500">
                                        {formatMoney(item.preco * item.qtty)}
                                    </div>
                                </div>
                            ))}
                            <div className='mt-2'>
                                {error && <FlashMessage message={error} success={false} />}
                            </div>
                            <div className="mt-4 text-right">
                                <div className="text-lg font-semibold mb-2 text-gray-500">
                                    Total: {formatMoney(total)}
                                </div>
                                <button
                                    onClick={addCart}
                                    className={`w-full py-2 px-4 text-white rounded-md transition duration-200 ${payload.products.length === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-700"}`}
                                    disabled={payload.products.length === 0}
                                >
                                    Adicionar ao carrinho
                                </button>
                                <Link to="/carrinho">
                                    <button
                                        onClick={addCart}
                                        className={`w-full mt-4 py-2 px-4 text-white rounded-md transition duration-200 bg-blue-500 hover:bg-blue-600`}
                                    >
                                        Ir para o carrinho
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div></>
            )}
        </div>
    );
};

export default ProductsCart;
