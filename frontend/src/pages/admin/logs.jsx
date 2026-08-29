import { useState } from 'react'
import { Filter, Eye, FileText, AlertTriangle, Info, AlertCircle, Clock } from 'lucide-react'

export default function Logs() {
    const [selectedLog, setSelectedLog] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')

    const logs = [
        { 
            id: 1, 
            level: 'error', 
            message: 'Échec de connexion à la base de données', 
            source: 'Database Service',
            timestamp: '2024-08-28 11:25:00',
            time: 'Il y a 2 min',
            details: 'Connection timeout after 30 seconds. Retrying...',
            userId: 'user_123',
            ip: '192.168.1.100'
        },
        { 
            id: 2, 
            level: 'warning', 
            message: 'Mémoire système élevée', 
            source: 'System Monitor',
            timestamp: '2024-08-28 11:22:00',
            time: 'Il y a 5 min',
            details: 'Memory usage at 85%. Consider scaling resources.',
            userId: 'system',
            ip: 'localhost'
        },
        { 
            id: 3, 
            level: 'info', 
            message: 'Nouvel utilisateur connecté', 
            source: 'Auth Service',
            timestamp: '2024-08-28 11:15:00',
            time: 'Il y a 12 min',
            details: 'User admin successfully logged in from 192.168.1.45',
            userId: 'admin',
            ip: '192.168.1.45'
        },
        { 
            id: 4, 
            level: 'error', 
            message: 'Règle IDS non valide', 
            source: 'IDS Engine',
            timestamp: '2024-08-28 11:02:00',
            time: 'Il y a 25 min',
            details: 'Rule IDS-009 has invalid syntax. Skipping rule execution.',
            userId: 'system',
            ip: '192.168.1.200'
        },
        { 
            id: 5, 
            level: 'info', 
            message: 'Sauvegarde terminée', 
            source: 'Backup Service',
            timestamp: '2024-08-28 10:42:00',
            time: 'Il y a 45 min',
            details: 'Daily backup completed successfully. Size: 2.5GB',
            userId: 'system',
            ip: 'localhost'
        },
        { 
            id: 6, 
            level: 'warning', 
            message: 'Tentative d\'accès non autorisé', 
            source: 'API Gateway',
            timestamp: '2024-08-28 10:27:00',
            time: 'Il y a 1 heure',
            details: 'Unauthorized access attempt to /admin/users from 192.168.1.99',
            userId: 'unknown',
            ip: '192.168.1.99'
        },
        { 
            id: 7, 
            level: 'info', 
            message: 'Mise à jour système', 
            source: 'Update Service',
            timestamp: '2024-08-28 09:27:00',
            time: 'Il y a 2 heures',
            details: 'System updated to version 2.1.0 successfully',
            userId: 'admin',
            ip: '192.168.1.33'
        },
        { 
            id: 8, 
            level: 'error', 
            message: 'Service non disponible', 
            source: 'Load Balancer',
            timestamp: '2024-08-28 08:27:00',
            time: 'Il y a 3 heures',
            details: 'Backend service unavailable. Health check failed.',
            userId: 'system',
            ip: '192.168.1.67'
        },
    ]

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
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[level]}`}>
                <Icon className="w-3 h-3" />
                {level.toUpperCase()}
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

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'all' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('all')}
                        >
                            Tous les logs
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'error' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('error')}
                        >
                            Erreurs
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'warning' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('warning')}
                        >
                            Avertissements
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'info' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('info')}
                        >
                            Informations
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total logs</p>
                            <p className="text-xl font-bold text-gray-900">{logs.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Erreurs</p>
                            <p className="text-xl font-bold text-gray-900">
                                {logs.filter(l => l.level === 'error').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Avertissements</p>
                            <p className="text-xl font-bold text-gray-900">
                                {logs.filter(l => l.level === 'warning').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Niveau</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Message</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateur</th>
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
                                        <span className="text-sm text-gray-900">{log.userId}</span>
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
                    {filteredLogs.length === 0 && (
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
                    <div className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-5">Détails du log</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                {getLevelBadge(selectedLog.level)}
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedLog.message}</h4>
                                    <p className="text-sm text-gray-500">{selectedLog.source}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
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
