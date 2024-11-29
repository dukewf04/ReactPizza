import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import PizzasTable from '../components/tables/PizzasTable/PizzasTable';
import UsersTable from '../components/tables/UsersTable/UsersTable';
import UserAuth from '../services/userAuth/userAuth';
import { useNavigate } from 'react-router-dom';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Главное',
  },
  {
    segment: 'pizzas',
    title: 'Список пицц',
    icon: <LocalPizzaIcon />,
  },
  {
    segment: 'users',
    title: 'Список пользователей',
    icon: <GroupIcon />,
  },
  {
    kind: 'divider',
  }
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: false },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

function AdminPanel(props) {
  const router = useDemoRouter('/pizzas');
  const navigate = useNavigate();
  const user = new UserAuth();

  React.useEffect(() => {
    if (!user.hasRole('admin')) {
      navigate('/');
      return;
    }
  }, []);

  if (!user.hasRole('admin')) {
    return <></>;
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" />,
        title: 'Административная панель',
      }}
    >
      <DashboardLayout>
        {router.pathname === '/pizzas' ? (
          <PizzasTable />
        ) : router.pathname === '/users' ? (
          <UsersTable />
        ) : (
          <div className="p-3">{router.pathname === '/reports/sales' ? 'Продажи' : 'Трафик'}</div>
        )}
      </DashboardLayout>
    </AppProvider>
  );
}

export default AdminPanel;
