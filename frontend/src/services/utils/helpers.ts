import { CartItem } from "../../types/Cart";

export const formatMoney = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export const totalCart = (val: CartItem[]) => {
    return val.reduce((acc, item) => acc + item.totalPrice, 0);
} 