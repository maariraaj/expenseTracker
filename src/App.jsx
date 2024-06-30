import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthPage from './components/authentication/AuthPage';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/profile/UpdateProfile';
import ResetPassword from './components/authentication/ResetPassword';
import Expenses from './components/expense/Expenses';
import RootLayout from './components/navigation/Root';
import { useSelector } from 'react-redux';


function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const theme = useSelector((state) => state.theme.theme);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RootLayout />
      ),
      children: [
        { path: '/', element: isLoggedIn ? <Expenses /> : <AuthPage /> },
        { path: '/profile', element: isLoggedIn ? <Profile /> : <AuthPage /> },
        { path: '/updateProfile', element: isLoggedIn ? <UpdateProfile /> : <AuthPage /> },
        { path: '/resetPassword', element: isLoggedIn ? <Profile /> : <ResetPassword /> },
        { path: '/expenses', element: isLoggedIn ? <Expenses /> : <AuthPage /> }
      ]
    }
  ]);

  return (
    <div className={`App ${theme === true ? 'bg-dark text-light' : ''}`}>
      <div className='container'>
      <RouterProvider router={router} />
      </div>
      
    </div>
  )
}

export default App;
