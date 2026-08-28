import Card from '../../components/ui/card'
import Badge from '../../components/ui/badge'
import Button from '../../components/ui/button'

import { 
    RefreshCw,
    Siren, ClipboardList, Settings, Users 
} from 'lucide-react'

export default function Index_admin() {
    const stats = [
        { title: 'Alertes Actives', value: '24', change: '+3', icon: '🚨', color: 'danger' },
        { title: 'Logs Aujourd\'hui', value: '1,234', change: '+156', icon: '📋', color: 'info' },
        { title: 'Règles IDS', value: '42', change: '+2', icon: '⚙️', color: 'success' },
        { title: 'Utilisateurs Actifs', value: '8', change: '0', icon: '👥', color: 'primary' },
    ]

    const recentAlerts = [
        { id: 1, severity: 'critical', message: 'Tentative d\'intrusion détectée', source: '192.168.1.100', time: 'Il y a 2 min' },
        { id: 2, severity: 'high', message: 'Connexion multiple échouée', source: '192.168.1.45', time: 'Il y a 5 min' },
        { id: 3, severity: 'medium', message: 'Anomalie de trafic détectée', source: '192.168.1.200', time: 'Il y a 12 min' },
        { id: 4, severity: 'low', message: 'Scan de ports suspect', source: '192.168.1.78', time: 'Il y a 25 min' },
        { id: 5, severity: 'medium', message: 'Pattern IDS matché', source: '192.168.1.156', time: 'Il y a 45 min' },
    ]

    const severityColors = {
        critical: 'danger',
        high: 'danger',
        medium: 'warning',
        low: 'info'
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Vue d'ensemble du SOC</p>
                </div>
                <Button variant="primary" 
                    icone={<RefreshCw className="w-4 h-4" />}
                    >Rafraîchir</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center py-4 justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Alertes Actives</p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">24</p>
                        </div>
                        <div className="text-4xl">
                            <Siren size={42} className='text-gray-500' />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center py-4 justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Logs Aujourd'hui</p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">1,234</p>
                        </div>
                        <div className="text-4xl">
                            <ClipboardList size={42} className='text-gray-500' />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center py-4 justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Règles IDS</p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">42</p>
                        </div>
                        <div className="text-4xl">
                            <Settings size={42} className='text-gray-500' />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center py-4 justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Utilisateurs Actifs</p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">8</p>
                        </div>
                        <div className="text-4xl">
                            <Users size={42} className='text-gray-500' />
                        </div>
                    </div>
                </Card>
            </div>



            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alerts */}
                <Card 
                    title="Alertes Récentes" 
                    subtitle="Les 5 dernières alertes"
                    className="lg:col-span-2"
                >
                    <div className="space-y-3">
                        {recentAlerts.map((alert) => (
                            <div 
                                key={alert.id}
                                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Badge variant={severityColors[alert.severity]}>
                                        {alert.severity.toUpperCase()}
                                    </Badge>
                                    <div>
                                        <p className="font-medium text-gray-900">{alert.message}</p>
                                        <p className="text-sm text-gray-500">{alert.source}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button variant="ghost" className="w-full">Voir toutes les alertes</Button>
                    </div>
                </Card>

                {/* System Status */}
                <Card title="État du Système" subtitle="Statut des composants du SOC">
                    <div className="space-y-4">
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
                </Card>
            </div>
        </div>
    )
}