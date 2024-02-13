import { onAuthStateChanged } from 'firebase/auth';
import React, { lazy, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthRoutes from 'src/components/PrivateRoutes/AuthRoutes/AuthRoutes';
import UnauthRoutes from 'src/components/PrivateRoutes/UnauthRoutes/UnauthRoutes';
import { useAppDispatch } from '../hooks/redux';

import RootLayout from '../layout/RootLayout';
import { auth, setUser } from '../store/slice/user.slice';

const MainPage = lazy(() => import('./MainPage/MainPage'));
const SignInPage = lazy(() => import('./SignInPage/SignInPage'));
const SignUpPage = lazy(() => import('./SignUpPage/SignUpPage'));
const Page404 = lazy(() => import('./404/404'));

const Router = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  useLayoutEffect(() => {
    onAuthStateChanged(auth, (user) => {
      localStorage.setItem('isAuth', user?.email ? 'true' : 'false');
      dispatch(setUser({ email: user?.email || null }));
    });
  }, [dispatch, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route element={<UnauthRoutes />}>
          <Route index element={<MainPage />} />
        </Route>
        <Route element={<AuthRoutes />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default Router;
