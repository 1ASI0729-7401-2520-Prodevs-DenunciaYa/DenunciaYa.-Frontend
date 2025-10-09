import { Routes } from '@angular/router';

const login = () => import('../presentation/views/login-form/login-form')
  .then(m => m.LoginForm);
const register = () => import('../presentation/views/register-form/register-form')
  .then(m => m.RegisterComponent);
const forgotPassword = () => import('../presentation/views/forgot-password-form/forgot-password-form')
  .then(m => m.ForgotPasswordForm);
const resetPassword = () => import('../presentation/views/reset-password-form/reset-password-form')
  .then(m => m.ResetPasswordForm);

const payment = () => import('../presentation/views/payment-form/payment-form')
  .then(m => m.PaymentForm);
const plan = () => import('../presentation/views/plan-form/plan-form')
  .then(m => m.PlanForm);

/**
 * Authentication routes
 * @constant {Routes} authenticationRoutes - The authentication routes
 * @path /authentication/login - The login route
 * @path /authentication/register - The register route
 * @path /authentication/forgot-password - The forgot password route
 * @path /authentication/reset-password - The reset password route
 * @path /authentication/payment - The payment route
 * @path /authentication/plan - The plan selection route
 * @default Redirects to /authentication/login
 * @wildcard Redirects to /authentication/login
 * @author Omar Harold Rivera Ticllacuri
 */
export const authenticationRoutes: Routes = [
  { path: 'authentication/login', loadComponent: login },
  { path: 'authentication/register', loadComponent: register },
  { path: 'authentication/forgot-password', loadComponent: forgotPassword },
  { path: 'authentication/reset-password', loadComponent: resetPassword },
  {path: 'authentication/payment', loadComponent: payment },
  {path: 'authentication/plan', loadComponent: plan },
  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/authentication/login' }
];
