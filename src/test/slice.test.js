import expensesSlice, { initialExpensesState, setExpenses } from "../store/expenses";
import authSlice, { initialAuthState, login, logout } from "../store/auth";
import themeSlice, { initialThemeState, setTheme } from "../store/theme";

describe("tests for Initialstate", () => {
  test("initialize Expense slice with initialValue", () => {
    const listSliceInit = expensesSlice(initialExpensesState, { type: "unknown" });
    expect(listSliceInit).toBe(initialExpensesState);
  });
  test("initialize Auth slice with initialValue", () => {
    const authSliceInit = authSlice(initialAuthState, { type: "unknown" });
    expect(authSliceInit).toBe(initialAuthState);
  });
  test("initialize theme slice with initialValue", () => {
    const themeSliceInit = themeSlice(initialThemeState, { type: "unknown" });
    expect(themeSliceInit).toBe(initialThemeState);
  });
 test('should handle expenses slice initial state', () => {
    expect(expensesSlice(undefined, {})).toEqual({ "expenses": [] });
  });
 test('should handle auth slice initial state', () => {
    expect(authSlice(undefined, {})).toEqual({
      "isLoggedIn": false,
      "token": null,
      "loggedInEmail": null
    });
  });
 test('should handle theme slice initial state', () => {
    expect(themeSlice(undefined, {})).toEqual({ "theme": false });
  });
});

describe('testExpenses tracker slices', () => {
  test('should handle expenses', () => {
    const initialState = {
      expenses: [],
    };
  
    const nextState = expensesSlice(initialState, setExpenses({
      id: `1000_EMI_${Math.random().toString()}`,
      amount: 1000,
      description: 'It is a description',
      category: 'EMI'
    }
    ));
    expect(typeof nextState).toBe('object');
    expect(nextState.expenses).toEqual({
      id: expect.any(String),
      amount: expect.any(Number),
      description: expect.any(String),
      category: expect.any(String)
    });
  });
  test('should handle auth login', ()=>{
    const initialState = {
      isLoggedIn: false,
      token: null,
      loggedInEmail: null
    };
  
    const nextState = authSlice(initialState, login({ 
      token: 123, 
      email: "test@test.com" }
    ));
    expect(typeof nextState).toBe('object');
    expect(nextState).toEqual({
      isLoggedIn: expect.any(Boolean),
      token: expect.any(Number),
      loggedInEmail: expect.any(String)
    });
  });

  test('should handle auth logout', () => {
    const initialState = {
      isLoggedIn: false,
      token: null,
      loggedInEmail: null
    };

    const nextState = authSlice(initialState, logout());
    expect(typeof nextState).toBe('object');
    expect(nextState).toEqual({
      token: expect.any(String),
      loggedInEmail: null,
      isLoggedIn: expect.any(Boolean)
    });
  });

  test('should handle theme', () => {
    const initialState = {
      theme: false,
    };
  
    const nextState = themeSlice(initialState, setTheme(true));
    expect(typeof nextState).toBe('object');
    expect(nextState.theme).toEqual(true);
  });
});