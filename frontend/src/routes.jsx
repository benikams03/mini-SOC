import { createBrowserRouter } from 'react-router-dom'

import Layout_admin from './components/common/layout'
import Index_admin from './pages/admin'

export const routes = createBrowserRouter([
    {
        path: "/",
        element: 'hello'
    },
    {
        path: "/admin",
        element: <Layout_admin />,
        children: [
            {
                path: "",
                element: <Index_admin />
            }
        ]
    }
])