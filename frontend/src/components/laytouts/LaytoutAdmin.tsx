import { ReactNode } from 'react';
import { Link } from 'react-router-dom';


interface LayoutProps {
    title: string;
    children: ReactNode;
}


const LayoutAdmin = (props: LayoutProps) => {
    const userType = localStorage.getItem('user_type');

    return (
        <div>
            <title>{props.title}</title>
            <div className="min-h-screen">
                <nav className="bg-blue-600 p-4 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/dashboard" className="text-white font-semibold text-xl hover:text-blue-200">
                            Dashboard
                        </Link>
                        <div className="space-x-4">
                            {userType === 'CLIENT' && (
                                <>
                                    <Link to="#" className="text-white hover:text-blue-200">
                                        Sair
                                    </Link>
                                </>
                            )}
                            {userType !== 'CLIENT' && (
                                <>
                                    <Link to="/produtos" className="text-white hover:text-blue-200">
                                        Produtos
                                    </Link>
                                    <Link to="/register-produto" className="text-white hover:text-blue-200">
                                        Registrar Produto
                                    </Link>
                                    <Link to="#" className="text-white hover:text-blue-200">
                                        Sair
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
                <div className="container mx-auto p-6">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default LayoutAdmin;
