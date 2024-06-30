import { createSlice } from "@reduxjs/toolkit";

export const initialThemeState = {
    theme: false
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: initialThemeState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
        }
    }
});

export const themeActions = themeSlice.actions;

export const {setTheme}=themeSlice.actions;

export default themeSlice.reducer;