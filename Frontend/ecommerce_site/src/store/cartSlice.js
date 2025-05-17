import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
            state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        updateCartItem: (state, action) => {
            const { productId, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item._id === productId);
            if (itemIndex !== -1) {
                state.items[itemIndex].quantity = quantity;
                state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
                state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
        },
        removeCartItem: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item._id !== productId);
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
    },
});

export const { setCart, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 