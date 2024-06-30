import { createSlice } from "@reduxjs/toolkit";

const tokenFromLocalStorage = localStorage.getItem('token');
const emailFromLocalStorage = localStorage.getItem('email');

export const initialAuthState = {
    isLoggedIn: !!tokenFromLocalStorage,
    token: tokenFromLocalStorage,
    loggedInEmail: emailFromLocalStorage
};

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("email", action.payload.email);
            state.isLoggedIn = !!state.token;
            state.loggedInEmail = action.payload.email;
        },
        logout(state) {
            state.token = '';
            localStorage.removeItem("token");
            state.isLoggedIn = false;
        }
    }
});

export const authActions = authSlice.actions;

export const {login, logout}=authSlice.actions;

export default authSlice.reducer;