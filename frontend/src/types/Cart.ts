export interface Cart {
    productId: number;
    qtty: number;
}

export interface Payload { products: Cart[]; }

export interface CartItem {
    productId: number;
    name: string;
    qtty: number;
    price: number;
    totalPrice: number;
}

export interface Items { items: CartItem[]; }