export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    nome_usuario: string;
}

export interface ProductCart {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    qtty: number;
}

