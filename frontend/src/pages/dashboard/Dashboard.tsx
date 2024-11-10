import React, { useEffect, useState } from 'react';
import Layout from '../../components/laytouts/LaytoutAdmin';
import { formatMoney } from '../../services/utils/helpers';
import Loader from '../../components/loader/Loader';
import FlashMessage from '../../components/flash-message/FlashMenssage';
import { user } from '../../services/api/auth/Authorization';
import { getOrders } from '../../services/api/cart/Cart';

interface ItemPedido {
    produto_id: number;
    produto_nome: string;
    produto_descricao: string;
    pedido_produto_valor: number;
}

interface Pedido {
    pedido_id: number;
    pedido_data: string;
    pedido_status: string;
    nome_usuario: string;
    id_user: number;
    items: ItemPedido[];
}

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    const getPedidos = async () => {
        const userId = await user();
        const userType = localStorage.getItem('user_type');
        setLoading(true);
        setError(null);
        try {
            const response = await getOrders(userType == 'CLIENT' ? userId : undefined);
            if (response && response.length > 0) {
                setPedidos(response);
            }
        } catch (error) {
            setError('Error no servidor, tente novamente mais tarde.')
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getPedidos();
    }, []);
    return (
        <Layout title={'Dashboard'}>
            <div className='mt-2'>{error && <FlashMessage message={error} success={false} />}</div>
            {loading ? (
                <Loader height={50} />
            ) : (
                <div className="container mx-auto p-6">
                    <table className="min-w-full table-auto bg-white border border-gray-300 rounded-md shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left text-gray-500">Número do Pedido</th>
                                <th className="py-2 px-4 border-b text-left text-gray-500">Valor Total</th>
                                <th className="py-2 px-4 border-b text-left text-gray-500">Qtde Itens</th>
                                <th className="py-2 px-4 border-b text-left text-gray-500">Status</th>
                                <th className="py-2 px-4 border-b text-left text-gray-500">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-2 px-4 text-center text-gray-700">
                                        Nenhum Pedido vendido
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((pedido) => {
                                    const totalPedido = pedido.items.reduce((acc, item) => acc + item.pedido_produto_valor, 0);
                                    const quantidadeItems = pedido.items.length;

                                    return (
                                        <React.Fragment key={pedido.pedido_id}>
                                            <tr className="bg-gray-50">
                                                <td className="py-2 px-4 border-b text-gray-500">#{pedido.pedido_id}</td>
                                                <td className="py-2 px-4 border-b text-gray-500">{formatMoney(totalPedido)}</td>
                                                <td className="py-2 px-4 border-b text-gray-500">{quantidadeItems}</td>
                                                <td className="py-2 px-4 border-b text-gray-500">{pedido.pedido_status}</td>
                                                <td className="py-2 px-4 border-b text-gray-500">
                                                    {new Date(pedido.pedido_data).toLocaleDateString()}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td colSpan="6" className="p-0">
                                                    <table className="min-w-full">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="py-2 px-4 border-b text-left text-gray-500">Produto</th>
                                                                <th className="py-2 px-4 border-b text-left text-gray-500">Descrição</th>
                                                                <th className="py-2 px-4 border-b text-left text-gray-500">Qtde</th>
                                                                <th className="py-2 px-4 border-b text-left text-gray-500">Preço Unitário</th>
                                                                <th className="py-2 px-4 border-b text-left text-gray-500">Preço Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pedido.items.map((item, index) => {
                                                                const precoTotalItem = item.pedido_produto_valor;
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="py-2 px-4 border-b text-gray-500">
                                                                            {item.produto_nome}
                                                                        </td>
                                                                        <td className="py-2 px-4 border-b text-gray-500">{item.produto_descricao || '-'}</td>
                                                                        <td className="py-2 px-4 border-b text-gray-500">1</td>
                                                                        <td className="py-2 px-4 border-b text-gray-500">{formatMoney(item.pedido_produto_valor)}</td>
                                                                        <td className="py-2 px-4 border-b text-gray-500">{formatMoney(precoTotalItem)}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
