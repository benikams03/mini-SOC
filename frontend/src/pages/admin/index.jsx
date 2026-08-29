import { Siren, ClipboardList, Settings, Users, Activity, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function Index_admin() {
    const recentAlerts = [
        { id: 1, severity: 'critical', message: 'Tentative d\'intrusion détectée', source: '192.168.1.100', time: 'Il y a 2 min' },
        { id: 2, severity: 'high', message: 'Connexion multiple échouée', source: '192.168.1.45', time: 'Il y a 5 min' },
        { id: 3, severity: 'medium', message: 'Anomalie de trafic détectée', source: '192.168.1.200', time: 'Il y a 12 min' },
        { id: 4, severity: 'low', message: 'Scan de ports suspect', source: '192.168.1.78', time: 'Il y a 25 min' },
        { id: 5, severity: 'medium', message: 'Pattern IDS matché', source: '192.168.1.156', time: 'Il y a 45 min' },
    ]

    const getSeverityBadge = (severity) => {
        const styles = {
            critical: 'bg-red-100 text-red-700',
            high: 'bg-orange-100 text-orange-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-blue-100 text-blue-700'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
                {severity.toUpperCase()}
            </span>
        )
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-sm text-gray-600 mt-1">Vue d'ensemble du SOC</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Siren className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Alertes actives</p>
                            <p className="text-xl font-bold text-gray-900">24</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Logs aujourd'hui</p>
                            <p className="text-xl font-bold text-gray-900">1,234</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Règles IDS</p>
                            <p className="text-xl font-bold text-gray-900">42</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                            <p className="text-xl font-bold text-gray-900">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alerts */}
                <div className="bg-white border border-gray-200 rounded-lg lg:col-span-2">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Alertes récentes</h3>
                        <p className="text-sm text-gray-500">Les 5 dernières alertes</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {recentAlerts.map((alert) => (
                            <div 
                                key={alert.id}
                                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {getSeverityBadge(alert.severity)}
                                    <div>
                                        <p className="font-medium text-gray-900">{alert.message}</p>
                                        <p className="text-sm text-gray-500">{alert.source}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 pt-0 border-t border-gray-200">
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Voir toutes les alertes
                        </button>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">État du système</h3>
                        <p className="text-sm text-gray-500">Statut des composants du SOC</p>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Collecteur de Logs</p>
                                <p className="text-sm text-green-600">Opérationnel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Moteur IDS</p>
                                <p className="text-sm text-green-600">Opérationnel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Base de données</p>
                                <p className="text-sm text-yellow-600">Charge élevée</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}