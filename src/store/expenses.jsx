import { createSlice } from "@reduxjs/toolkit";

export const initialExpensesState = {
  expenses: [],
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState: initialExpensesState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
  },
});

export const expensesActions = expensesSlice.actions;
export const { setExpenses } = expensesSlice.actions;

export default expensesSlice.reducer;
