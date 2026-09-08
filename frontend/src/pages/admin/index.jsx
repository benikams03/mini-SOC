import { useState, useEffect } from 'react'
import { Siren, ClipboardList, Settings, Users, Activity, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'
import { get_dashboard } from '../../services/dashboard.js'
import { useNavigate } from 'react-router-dom'

export default function Index_admin() {
    const navigate = useNavigate()
    const [recentAlerts, setRecentAlerts] = useState([])
    const [stats, setStats] = useState({
        alertsCount: 0,
        logsCount: 0,
        usersCount: 0,
        rulesCount: 42 // Gardé inchangé comme demandé
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        setLoading(true)
        try {
            const response = await get_dashboard()
            if (response.success) {
                setRecentAlerts(response.data.recentAlerts || [])
                setStats({
                    alertsCount: response.data.alertsCount || 0,
                    logsCount: response.data.logsCount || 0,
                    usersCount: response.data.usersCount || 0,
                    rulesCount: 42 // Gardé inchangé comme demandé
                })
            } else {
                if(response.token_invalid){
                    localStorage.removeItem('access_token')
                    navigate('/login')
                }else{
                    setError('Erreur lors du chargement du dashboard')
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error)
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const getSeverityBadge = (severity) => {
        const styles = {
            CRITIQUE: 'bg-red-100 text-red-700',
            HIGH: 'bg-orange-100 text-orange-700',
            MEDIUM: 'bg-yellow-100 text-yellow-700',
            LOW: 'bg-blue-100 text-blue-700'
        }
        const style = styles[severity] || 'bg-gray-100 text-gray-700'
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                {severity || 'UNKNOWN'}
            </span>
        )
    }

    const getTimeAgo = (date) => {
        if (!date) return 'N/A'
        const now = new Date()
        const diffMs = now - new Date(date)
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'À l\'instant'
        if (diffMins < 60) return `Il y a ${diffMins} min`
        if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
        if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
        return new Date(date).toLocaleDateString('fr-FR')
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
                            <p className="text-sm text-gray-600">Alertes</p>
                            <p className="text-xl font-bold text-gray-900">{stats.alertsCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Logs</p>
                            <p className="text-xl font-bold text-gray-900">{stats.logsCount}</p>
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
                            <p className="text-xl font-bold text-gray-900">{stats.rulesCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Utilisateurs</p>
                            <p className="text-xl font-bold text-gray-900">{stats.usersCount}</p>
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
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Chargement...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">{error}</div>
                        ) : recentAlerts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Aucune alerte récente</div>
                        ) : (
                            recentAlerts.map((alert) => (
                                <div 
                                    key={alert._id}
                                    className="flex items-center justify-between py-2 px-6 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {getSeverityBadge(alert.severity)}
                                        <div>
                                            <p className="font-medium text-gray-900">{alert.title}</p>
                                            <p className="text-sm text-gray-500">{alert.user_agent?.ip || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{getTimeAgo(alert.created_at)}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 pt-0 border-t border-gray-200">
                        <button 
                            onClick={() => navigate('/admin/alerts')}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
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
                    </div>
                </div>
            </div>
        </div>
    )
}