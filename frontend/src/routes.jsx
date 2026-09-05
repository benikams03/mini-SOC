import { createBrowserRouter } from 'react-router-dom'

import Layout_admin from './components/common/layout'
import CTFLayout from './components/common/ctf_layout'
import Index_admin from './pages/admin'
import Alerts from './pages/admin/alerts'
import Logs from './pages/admin/logs'
import Rules from './pages/admin/rules'
import Users from './pages/admin/users'
import Login from './pages/login'
import Register from './pages/register'
import EmailConfirmation from './pages/email-confirmation'
import MFA from './pages/mfa'

import CTFIndex from './pages/test'
import LoginAttack from './pages/test/login-attack'
import ProtectedAccess from './pages/test/protected-access'
import DDoS from './pages/test/ddos'
import XSS from './pages/test/xss'
import SQLi from './pages/test/sqli'
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
        path: "/simulation",
        element: <CTFLayout />,
        children: [
            {
                path: "",
                element: <CTFIndex />
            },
            {
                path: "login-attack",
                element: <LoginAttack />
            },
            {
                path: "protected-access",
                element: <ProtectedAccess />
            },
            {
                path: "ddos",
                element: <DDoS />
            },
            {
                path: "xss",
                element: <XSS />
            },
            {
                path: "sqli",
                element: <SQLi />
            }
        ]
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
        ]
    }
])