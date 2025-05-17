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
            localStorage.setItem('email', action.payload);
            state.email = action.payload;
        },
        setAuth: (state, action) => {
            const isAuthenticated = action.payload;
            if (isAuthenticated) {
                localStorage.setItem('token', 'true');
            } else {
                localStorage.removeItem('token');
            }
            state.isAuthenticated = isAuthenticated;
        },
        logout: (state) => {
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            state.email = '';
            state.isAuthenticated = false;
        },
    },
});

export const { setEmail, setAuth, logout } = userSlice.actions;
export default userSlice.reducer;
