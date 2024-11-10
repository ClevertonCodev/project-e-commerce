import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { user } from '../../services/api/auth/Authorization';
import { findAll } from '../../services/api/product/Product';
import { Produto } from '../../types/Produto';
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { Link } from 'react-router-dom';
import Layout from '../../components/laytouts/LaytoutAdmin';

const ProductTable = () => {
    const [products, setProducts] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProducts = async () => {
        const userId = await user();
        setLoading(true);
        if (!userId) {
            return;
        }

        try {
            const response = await findAll(userId);
            if (response && response.length > 0) {
                setProducts(response);
            }
        } catch (error) {
            setError('Error no servidor, tente novamente mais tarde.')
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getProducts();
    }, []);

    const handleDelete = (productToDelete: number) => {

    };
    return (
        <Layout title={'Produtos'}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Tabela de Produtos</h1>
                <div className="mb-6 text-right">
                    <Link to="/register-produto">
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Adicionar produtos
                        </button>
                    </Link>
                </div>
                <div className='mt-2'>{error && <FlashMessage message={error} success={false} />}</div>
                {loading ? (
                    <Loader height={50} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="text-left text-gray-700 bg-gray-100">
                                    <th className="py-2 px-4 border-b ">Nome</th>
                                    <th className="py-2 px-4 border-b">Descrição</th>
                                    <th className="py-2 px-4 border-b">Preço</th>
                                    <th className="py-2 px-4 border-b">Estoque</th>
                                    <th className="py-2 px-4 border-b">Usuário</th>
                                    <th className="py-2 px-4 border-b">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-2 px-4 text-center text-gray-700">
                                            Nenhum produto cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b text-gray-700">{product.nome}</td>
                                            <td className="py-2 px-4 border-b text-gray-700">{product.descricao || '-'}</td>
                                            <td className="py-2 px-4 border-b text-gray-700">R$ {product.preco.toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b text-gray-700">{product.estoque}</td>
                                            <td className="py-2 px-4 border-b text-gray-700">{product.nome_usuario}</td>
                                            <td className="py-2 px-4 border-b text-center">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-500 bg-blue-50 bg-opacity-50 hover:text-red-700 transition duration-200"
                                                    title="Excluir"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProductTable;
