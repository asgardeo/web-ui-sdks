import {NavigationGuardNext, RouteLocationNormalized} from 'vue-router';
import {useAsgardeo} from './public-api';

/**
 * createAuthGuard returns a Vue Router navigation guard that checks if the user is authenticated.
 * If not, it redirects to the specified login route.
 *
 * @param redirectPath - The path to redirect to if the user is not authenticated.
 * @returns A navigation guard function.
 */
export const createAuthGuard = (redirectPath: string = '/login') => {
  return async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      const {
        state: {isAuthenticated},
      } = useAsgardeo();
      if (isAuthenticated) {
        next();
      } else {
        next(redirectPath);
      }
    } catch (err) {
      // In case of an error, redirect to the login page.
      next(redirectPath);
    }
  };
};

/**
 * authGuard is a default guard that can be directly used in your route definitions.
 * It uses the createAuthGuard helper with a default redirect path.
 */

// example usage

// import { createRouter, createWebHistory } from 'vue-router';
// import { createAuthGuard } from './auth-guard';
// import Home from './views/Home.vue';
// import Login from './views/Login.vue';

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home,
//     beforeEnter: createAuthGuard(), // Protect this route
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login,
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });

// export default router;
