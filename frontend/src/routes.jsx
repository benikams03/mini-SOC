import { createBrowserRouter } from 'react-router-dom'

import Layout_admin from './components/common/layout'
import Index_admin from './pages/admin'
import Alerts from './pages/admin/alerts'
import Logs from './pages/admin/logs'
import Rules from './pages/admin/rules'
import Users from './pages/admin/users'
import Login from './pages/login'
import MFA from './pages/mfa'

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
        path: "/mfa",
        element: <MFA />
    },
    {
        path: "/admin",
        element: <Layout_admin />,
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