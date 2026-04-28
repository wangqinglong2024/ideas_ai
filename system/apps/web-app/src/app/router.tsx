import { createRouter, createRoute, createRootRoute, Outlet, Navigate } from '@tanstack/react-router';
import { Layout } from './Layout.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { RegisterPage } from '../pages/RegisterPage.tsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.tsx';
import { MePage } from '../pages/MePage.tsx';
import { ChinaCategoryCardsPage } from '../pages/china/ChinaCategoryCardsPage.tsx';
import { ChinaArticleListPage } from '../pages/china/ChinaArticleListPage.tsx';
import { ChinaArticleDetailPage } from '../pages/china/ChinaArticleDetailPage.tsx';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/login', component: LoginPage });
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/register', component: RegisterPage });
const forgotRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/forgot', component: ForgotPasswordPage });
// 旧 /discover 路由统一聚合到「发现中国」
const discoverRoute = createRoute({ getParentRoute: () => rootRoute, path: '/discover', component: () => <Navigate to="/china" replace /> });
const meRoute = createRoute({ getParentRoute: () => rootRoute, path: '/me', component: MePage });

const chinaIndexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/china', component: ChinaCategoryCardsPage });
const chinaCatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/china/categories/$code', component: ChinaArticleListPage });
const chinaArticleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/china/articles/$code', component: ChinaArticleDetailPage });

const routeTree = rootRoute.addChildren([
  indexRoute, loginRoute, registerRoute, forgotRoute, discoverRoute, meRoute,
  chinaIndexRoute, chinaCatRoute, chinaArticleRoute,
]);

export const router = createRouter({ routeTree, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
