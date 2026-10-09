import { createBrowserRouter } from 'react-router-dom'

import Layout_admin from './components/common/layout'
import Index_admin from './pages/admin'
import Alerts from './pages/admin/alerts'
import Logs from './pages/admin/logs'
import Rules from './pages/admin/rules'
import Users from './pages/admin/users'

import SimulationsIndex from './pages/admin/simulations'
import LoginAttack from './pages/admin/simulations/login-attack'
import ProtectedAccess from './pages/admin/simulations/protected-access'
import DDoS from './pages/admin/simulations/ddos'
import SQLInjection from './pages/admin/simulations/sql-injection'
import XSS from './pages/admin/simulations/xss'
import CSRF from './pages/admin/simulations/csrf'

import Login from './pages/login'
import Register from './pages/register'
import EmailConfirmation from './pages/email-confirmation'
import MFA from './pages/mfa'
import ConfirmAccount from './pages/confirm_account'

import { ProtectedRoute } from './lib/middleware'

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/email-confirmation/qwertyuijhgfdsdvbgfewertyuuysdfvcxsdfgfdertyuufewsdfvbvdssdfghjhgfddfbvcx/:email",
        element: <EmailConfirmation />
    },
    {
        path: "/confirm-account",
        element: <ConfirmAccount />
    },
    {
        path: "/mfa/qwertyuijhgfdsdvbgfewertyuuysdfvcxsdfgfdertyuufewsdfvbvdssdfghjhgfddfbvcx/:email",
        element: <MFA />
    },
    {
        path: "/admin",
        element: <ProtectedRoute><Layout_admin /></ProtectedRoute>,
        children: [
            {
                path: "",
                element: <Index_admin />
            },
            {
                path: "alerts",
                element: <Alerts />
            },
            {
                path: "logs",
                element: <Logs />
            },
            {
                path: "rules",
                element: <Rules />
            },
            {
                path: "users",
                element: <Users />
            },
            {
                path: "simulations",
                element: <SimulationsIndex />
            },
            {
                path: "simulations/login-attack",
                element: <LoginAttack />
            },
            {
                path: "simulations/protected-access",
                element: <ProtectedAccess />
            },
            {
                path: "simulations/ddos",
                element: <DDoS />
            },
            {
                path: "simulations/sql-injection",
                element: <SQLInjection />
            },
            {
                path: "simulations/xss",
                element: <XSS />
            },
            {
                path: "simulations/csrf",
                element: <CSRF />
            },
        ]
    }
])