import { Outlet, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { AlertTriangle, PanelRight, 
    Terminal, Lock, Activity, Globe, Database, Home, ArrowLeft, LogOut } 
    from "lucide-react"

export default function CTFLayout() {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const navigationItems = [
        { name: 'Accueil', path: '/ctf', icon: Home },
        { name: 'Force Brute', path: '/ctf/login-attack', icon: Terminal },
        { name: 'Accès Protégé', path: '/ctf/protected-access', icon: Lock },
        { name: 'DDoS', path: '/ctf/ddos', icon: Activity },
        { name: 'Injection XSS', path: '/ctf/xss', icon: Globe },
        { name: 'Injection SQL', path: '/ctf/sqli', icon: Database },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 p-2.5 ${
                    sidebarOpen ? 'w-68' : 'w-20'
                }`}
            >
                <div className="bg-gray-200 h-full rounded-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-gray-300 mx-3 py-2">
                            <div className="flex items-center gap-2">
                                <div className="bg-black inline-block p-1 rounded-md">
                                    <AlertTriangle className="text-white" />
                                </div>
                                { sidebarOpen && <h2 className="text-xl font-bold text-gray-800">CTF Lab</h2> }
                            </div>
                        </div>

                        <nav className="p-3 space-y-1">
                            {navigationItems.map((item) => {
                                const Icons = item.icon
                                return( 
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors transition-all ${
                                            isActive(item.path)
                                                ? 'bg-gray-50 text-gray-800 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icons className="transition-all" />
                                        { sidebarOpen && <span>{item.name}</span>}
                                    </Link> 
                                )
                            })}
                        </nav>
                    </div>

                    <div className="m-2" >
                        <Link 
                            to="/"
                            className="bg-white rounded-md p-2 flex items-center gap-2 cursor-pointer w-full"
                        >
                            <div className="bg-gray-300 p-2 rounded-md">
                               <ArrowLeft size={12} />
                            </div>
                            { sidebarOpen &&
                            <div className="text-gray-400">
                                <h2 className="font-semibold text-gray-600 text-md">Retour</h2>
                            </div> }
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main 
                className={`transition-all duration-300 ${
                    sidebarOpen ? 'ml-68' : 'ml-20'
                }`}
            >
                <div className="sticky top-0 bg-white py-4 px-2 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="group">
                            <PanelRight className="group-hover:text-gray-600 transition-colors text-gray-400 cursor-pointer" size={22} />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {navigationItems.map((item) => {
                                const Icons = item.icon
                                if (!isActive(item.path)) return null
                                return( 
                                    <h3 className="flex items-center gap-1">
                                        <Icons className="transition-all" size={19} />
                                        { sidebarOpen && <span className="">{item.name}</span>}
                                    </h3> 
                                )
                            })}
                            <span>/</span>
                            <h3>Simulation</h3>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
