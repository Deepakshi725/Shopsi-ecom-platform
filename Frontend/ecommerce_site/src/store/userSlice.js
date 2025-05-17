// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: localStorage.getItem('email') || '',
    isAuthenticated: !!localStorage.getItem('token'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
            localStorage.setItem('email', action.payload);
        },
        setAuth: (state, action) => {
            state.isAuthenticated = action.payload;
            if (!action.payload) {
                localStorage.removeItem('token');
                localStorage.removeItem('email');
            }
        },
        logout: (state) => {
            state.email = '';
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('email');
        },
    },
});

export const { setEmail, setAuth, logout } = userSlice.actions;
export default userSlice.reducer;
