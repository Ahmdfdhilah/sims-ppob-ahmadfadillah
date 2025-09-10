// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
// Import your layouts/components
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Toaster } from "@workspace/ui/components/sonner";
import { AuthProvider } from './components/Auth/AuthProvider';
import { LoginPage } from './pages/Auth/Login/LoginPage';
import { QueryProvider } from './providers/QueryProvider';
import { AuthLayout } from './components/layouts/AuthLayout';
import { authImg } from './lib/constants';
import { RegisterPage } from './pages/Auth/Register/RegisterPage';
import { MainLayout } from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard/DashboardPage';
import TopUpPage from './pages/Topup/TopupPage';
import TransactionHistoryPage from './pages/TransactionHistory/TransactionHistoryPage';
import PaymentPage from './pages/Payment/PaymentPage';
import { AccountPage } from './pages/Account/AccountPage';
// import ThemeToggle from './components/common/ThemeToggle';
// import { ThemeProvider } from './providers/ThemeProvider';

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <TooltipProvider>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <QueryProvider>
                {/* <ThemeProvider>   belum butuh theme*/}
                <BrowserRouter>
                  <Toaster />
                  {/* <ThemeToggle /> */}
                  <Routes>

                    {/* Auth route */}
                    <Route element={<AuthLayout rightSectionImage={authImg} />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Protected Main Route */}
                    <Route element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path='/top-up' element={<TopUpPage />}></Route>
                      <Route path='/transaction' element={<TransactionHistoryPage />}></Route>
                      <Route path='/payment/:serviceCode' element={<PaymentPage />}></Route>
                    </Route>

                    {/* Protected Account Route */}
                    <Route path='/account' element={<MainLayout showHeader={false} />}>
                      <Route index element={<AccountPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
                {/* </ThemeProvider> */}
              </QueryProvider>
            </AuthProvider>
          </PersistGate>
        </TooltipProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;