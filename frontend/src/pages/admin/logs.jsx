import { useState, useEffect } from 'react'
import { Filter, Eye, FileText, AlertTriangle, Info, AlertCircle, Clock } from 'lucide-react'
import { get_logs } from '../../services/logs.js'

export default function Logs() {
    const [selectedLog, setSelectedLog] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await get_logs()
                console.log('Response from API:', response)
                
                if (response.success) {
                    // Transformer les données de la base de données pour correspondre à la structure attendue
                    const transformedLogs = (response.data || []).map(log => ({
                        id: log._id || Math.random(),
                        level: log.type === 'error' ? 'error' : log.type === 'attente' ? 'warning' : 'info',
                        message: log.message || 'Sans message',
                        source: log.action || 'Système',
                        timestamp: log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR'),
                        time: log.created_at ? getTimeAgo(new Date(log.created_at)) : 'Maintenant',
                        details: `${log.method} ${log.route} - ${log.message}`,
                        userId: log.user || 'unknown',
                        ip: log.adress_ip || 'unknown',
                        originalDate: log.created_at ? new Date(log.created_at) : new Date()
                    }))
                    // Trier du plus récent au plus ancien
                    transformedLogs.sort((a, b) => b.originalDate - a.originalDate)
                    setLogs(transformedLogs)
                } else {
                    setError('Erreur lors du chargement des logs')
                }
            } catch (err) {
                setError('Erreur de connexion au serveur')
                console.error('Error fetching logs:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLogs()
    }, [])

    const getTimeAgo = (date) => {
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'À l\'instant'
        if (diffMins < 60) return `Il y a ${diffMins} min`
        if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
        if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
        return date.toLocaleDateString('fr-FR')
    }

    const filteredLogs = logs.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'error' && item.level === 'error') ||
            (filter === 'warning' && item.level === 'warning') ||
            (filter === 'info' && item.level === 'info')
        
        return matchesFilter
    })

    const getLevelBadge = (level) => {
        const styles = {
            error: 'bg-red-100 text-red-700',
            warning: 'bg-yellow-100 text-yellow-700',
            info: 'bg-blue-100 text-blue-700'
        }
        const icons = {
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info
        }
        const Icon = icons[level]
        return (
            <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full ${styles[level]}`}>
                <Icon className="w-4 h-4" />
            </span>
        )
    }

    const handleViewDetails = (log) => {
        setSelectedLog(log)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedLog(null)
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des logs</h2>
                    <p className="text-sm text-gray-600 mt-1">Consultez et analysez les journaux système</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{logs.length} logs</span>
                    </div>
                </div>
            </div>

            
            {/* Logs Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <Clock className="w-12 h-12 text-gray-400 mb-3 animate-spin" />
                            <p className="text-gray-600">Chargement des logs...</p>
                        </div>
                    ) : error ? (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
                            <p className="text-gray-600">{error}</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Niveau</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Message</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Heure</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            {getLevelBadge(log.level)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{log.message}</h4>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-900">{log.source}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-500">{log.time}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button 
                                                onClick={() => handleViewDetails(log)}
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
                    )}
                    {!isLoading && !error && filteredLogs.length === 0 && (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <FileText className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-gray-600">Aucun log trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Log Details Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                    <div className="bg-white border border-gray-300 w-full max-w-2xl p-4 md:p-6 rounded-lg shadow max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-5">Détails du log</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                {getLevelBadge(selectedLog.level)}
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedLog.message}</h4>
                                    <p className="text-sm text-gray-500">{selectedLog.source}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horodatage</label>
                                    <p className="text-gray-900 font-medium">{selectedLog.timestamp}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                                    <p className="text-gray-900">{selectedLog.userId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                                    <p className="text-gray-900">{selectedLog.ip}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                                    <p className="text-gray-900">{selectedLog.source}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Détails</label>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg break-words">
                                    {selectedLog.details}
                                </p>
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
