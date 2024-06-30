import React, { useEffect, useRef, useState } from 'react';
import ExpenseList from './ExpenseList';
import { useSelector, useDispatch } from 'react-redux';
import { expensesActions } from '../../store/expenses';
import { themeActions } from '../../store/theme';

const Expenses = () => {
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.expenses.expenses);

  const loggedInEmail = useSelector((state) => state.auth.loggedInEmail);

  const theme = useSelector((state) => state.theme.theme);

  const amountRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);

  const [premiumFeature, setPremiumFeature] = useState(false);

  const firebaseAPI = 'https://react-http-bb1f2-default-rtdb.firebaseio.com/';

  const firebaseEndpoint = `expenses/${loggedInEmail.replace(/[.@]/g, '')}.json`;

  const fetchData = () => {
    fetch(`${firebaseAPI}${firebaseEndpoint}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(responseData => {
        if (responseData) {
          dispatch(expensesActions.setExpenses(Object.values(responseData)));
        } else {
          dispatch(expensesActions.setExpenses([]));
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      id: `${amountRef.current.value}_${categoryRef.current.value}_${Math.random().toString()}`,
      amount: amountRef.current.value,
      description: descriptionRef.current.value,
      category: categoryRef.current.value
    };
    fetch(`${firebaseAPI}${firebaseEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newExpense)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to post data to Firebase');
        }
        return response.json();
      })
      .then(data => {
        console.log("POST", data);
        fetchData();
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });

    amountRef.current.value = '';
    descriptionRef.current.value = '';
    categoryRef.current.value = '';
  };
  const deleteExpenseHandler = (expenseId) => {
    const newExpense = expenses.filter(expense => expense.id !== expenseId);
    fetch(`${firebaseAPI}${firebaseEndpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExpense),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete expense');
        }
        return response.json();
      })
      .then(data => {
        console.log('Expense deleted successfully:', data);
        fetchData();
      })
      .catch(error => {
        console.error('Error delete expense:', error);
      });
  };
  const editExpenseHandler = (expenseId, expense) => {
    const newExpense = expenses.filter(expense => expense.id !== expenseId);
    fetch(`${firebaseAPI}${firebaseEndpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExpense),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update expense');
        }
        return response.json();
      })
      .then(data => {
        console.log('Expense updated successfully:', data);

        amountRef.current.value = expense.amount;
        descriptionRef.current.value = expense.description;
        categoryRef.current.value = expense.category;
      })
      .catch(error => {
        console.error('Error updating expense:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalExpenses = expenses.reduce((curNumber, expense) => {
    const intNumber = parseInt(expense.amount, 10);
    return curNumber + intNumber;
  }, 0);

  const isDisabled = totalExpenses > 10000 ? false : true;

  const premiumToggleHandler = () => {
    setPremiumFeature((prev) => prev = !prev);
  };
  const toggleThemeHandler = () => {
    if(theme){
      dispatch(themeActions.setTheme(false));
    }else{
      dispatch(themeActions.setTheme(true));
    }
    
  };

  function downloadCSV(csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleDownload = async () => {
    fetch(`${firebaseAPI}${firebaseEndpoint}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(responseData => {
        const data = Object.values(responseData);
        const header = Object.keys(data[0]);
        let csvContent = data.map(obj => header.map(key => obj[key]).join(','));
        let newCsvContent = [header.join(','), ...csvContent].join('\n');
        downloadCSV(newCsvContent);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Daily Expense Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount Spent</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                ref={amountRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                ref={descriptionRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                id="category"
                ref={categoryRef}
                required
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Petrol/Diesel">Petrol/Diesel</option>
                <option value="House rent">House Rent</option>
                <option value="EMI">EMI</option>
                <option value="Insurance">Insurance</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
      <h3 className='text-center mt-3'>
        Expense List:
        <button className='btn btn-info ms-3' onClick={premiumToggleHandler} disabled={isDisabled}>Activate Premium</button>
      </h3>
      {premiumFeature && (
        <div className={`card shadow-lg mt-3 mb-3 ${theme === true ? 'bg-light text-dark' : 'bg-dark text-light'}`}>
          <div className="card-body">
            <h5 className="card-title">Premium Features</h5>
            <button type="button" className={`btn btn-${theme === true ? 'dark' : 'light'} me-3`} onClick={toggleThemeHandler}>Toggle Theme</button>
            <button type="button" className="btn btn-warning" onClick={handleDownload} >Download Expenses</button>
          </div>
        </div>
      )}
      <div className="mt-4">
        {expenses && expenses.map((expense, index) => (
          <ExpenseList
            key={expense.id}
            id={expense.id}
            index={index}
            expense={expense}
            onDelete={deleteExpenseHandler}
            onEdit={editExpenseHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default Expenses;