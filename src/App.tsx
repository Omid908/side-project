import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Containers } from './pages/Containers';
import { Parts } from './pages/Parts';
import { Sales } from './pages/Sales';
import { Customers } from './pages/Customers';
import { Expenses } from './pages/Expenses';
import { Settings } from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'containers', element: <Containers /> },
      { path: 'parts', element: <Parts /> },
      { path: 'sales', element: <Sales /> },
      { path: 'customers', element: <Customers /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
]);

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return <RouterProvider router={router} />;
}
