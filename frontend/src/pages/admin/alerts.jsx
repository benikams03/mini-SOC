import { useState, useEffect } from 'react'
import { Filter, Eye, ShieldAlert, AlertTriangle, Clock } from 'lucide-react'
import { get_alerts } from '../../services/alerts.js'
import { useNavigate } from 'react-router-dom'

export default function Alerts() {
    const navigate = useNavigate()
    const [selectedAlert, setSelectedAlert] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Charger les alertes au montage du composant
    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        setLoading(true)
        try {
            const response = await get_alerts()
            if (response.success) {
                // Trier les alertes du plus récent au plus ancien
                const sortedAlerts = (response.data || []).sort((a, b) => {
                    const dateA = new Date(a.created_at || 0)
                    const dateB = new Date(b.created_at || 0)
                    return dateB - dateA
                })
                setAlerts(sortedAlerts)
            } else {
                if(response.token_invalid){
                    localStorage.removeItem('access_token')
                    navigate('/login')
                }else{
                    setError('Erreur lors du chargement des alertes')
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des alertes:', error)
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const filteredAlerts = alerts.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'critical' && item.severity === 'CRITIQUE') ||
            (filter === 'high' && item.severity === 'HIGH') ||
            (filter === 'medium' && item.severity === 'MEDIUM') ||
            (filter === 'low' && item.severity === 'LOW')
        
        return matchesFilter
    })

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


    const handleViewDetails = (alert) => {
        setSelectedAlert(alert)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedAlert(null)
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des alertes</h2>
                    <p className="text-sm text-gray-600 mt-1">Surveillez et gérez les alertes de sécurité</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <ShieldAlert className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{alerts.length} alertes</span>
                    </div>
                </div>
            </div>


            {/* Alerts Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {error ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-red-500">{error}</div>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement des alertes...</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Sévérité</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Titre</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Catégorie</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">IP</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Heure</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAlerts.map((alert) => (
                                <tr key={alert._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {getSeverityBadge(alert.severity)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{alert.category}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{alert.user_agent?.ip || 'N/A'}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">
                                            {alert.created_at ? new Date(alert.created_at).toLocaleString('fr-FR') : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => handleViewDetails(alert)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title="Voir les détails"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAlerts.length === 0 && (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <ShieldAlert className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-gray-600">Aucune alerte trouvée</p>
                        </div>
                    )}
                </div>
                )}
            </div>

            {/* Alert Details Modal */}
            {isModalOpen && selectedAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                    <div className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-5">Détails de l'alerte</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                {getSeverityBadge(selectedAlert.severity)}
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedAlert.title}</h4>
                                    <p className="text-sm text-gray-500">{selectedAlert.category}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Règle ID</label>
                                    <p className="text-gray-900 font-medium">{String(selectedAlert.ruleID || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité</label>
                                    <p className="text-gray-900">{String(selectedAlert.severity || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <p className="text-gray-900">{String(selectedAlert.category || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                    <p className="text-gray-900">{String(selectedAlert.action || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                                    <p className="text-gray-900 font-medium">{String(selectedAlert.user_agent?.ip || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Navigateur</label>
                                    <p className="text-gray-900">
                                        {String(selectedAlert.user_agent?.browser?.name || 'N/A')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Système d'exploitation</label>
                                    <p className="text-gray-900">
                                        {String(selectedAlert.user_agent?.os?.name || 'N/A')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type d'appareil</label>
                                    <p className="text-gray-900">{String(selectedAlert.user_agent?.device?.type || 'N/A')}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horodatage</label>
                                    <p className="text-gray-900">
                                        {selectedAlert.created_at ? new Date(selectedAlert.created_at).toLocaleString('fr-FR') : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                                    <p className="text-gray-900">{String(selectedAlert.user || 'N/A')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button 
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={closeModal}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
