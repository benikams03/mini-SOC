import { useState } from 'react'
import { Filter, Eye, ShieldAlert, AlertTriangle, Clock } from 'lucide-react'

export default function Alerts() {
    const [selectedAlert, setSelectedAlert] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')

    const alerts = [
        { 
            id: 1, 
            severity: 'critical', 
            message: 'Tentative d\'intrusion détectée', 
            source: '192.168.1.100', 
            time: 'Il y a 2 min',
            timestamp: '2024-08-28 11:25:00',
            device: 'Laptop-User-01',
            browser: 'Chrome 120.0',
            os: 'Windows 11',
            location: 'Paris, France',
            ruleId: 'IDS-001',
            category: 'Intrusion',
            description: 'Multiple failed login attempts detected from this IP address suggesting a brute force attack.',
            actionTaken: 'IP bloquée temporairement',
            status: 'En cours'
        },
        { 
            id: 2, 
            severity: 'high', 
            message: 'Connexion multiple échouée', 
            source: '192.168.1.45', 
            time: 'Il y a 5 min',
            timestamp: '2024-08-28 11:22:00',
            device: 'Desktop-Admin-03',
            browser: 'Firefox 115.0',
            os: 'Ubuntu 22.04',
            location: 'Lyon, France',
            ruleId: 'IDS-002',
            category: 'Authentication',
            description: '5 consecutive failed authentication attempts detected within 1 minute.',
            actionTaken: 'Compte verrouillé',
            status: 'Résolu'
        },
        { 
            id: 3, 
            severity: 'medium', 
            message: 'Anomalie de trafic détectée', 
            source: '192.168.1.200', 
            time: 'Il y a 12 min',
            timestamp: '2024-08-28 11:15:00',
            device: 'Server-Web-01',
            browser: 'N/A',
            os: 'CentOS 8',
            location: 'Marseille, France',
            ruleId: 'IDS-003',
            category: 'Network',
            description: 'Unusual traffic pattern detected - potential DDoS attack preparation.',
            actionTaken: 'Surveillance renforcée',
            status: 'En cours'
        },
        { 
            id: 4, 
            severity: 'low', 
            message: 'Scan de ports suspect', 
            source: '192.168.1.78', 
            time: 'Il y a 25 min',
            timestamp: '2024-08-28 11:02:00',
            device: 'Unknown',
            browser: 'N/A',
            os: 'Unknown',
            location: 'Unknown',
            ruleId: 'IDS-004',
            category: 'Reconnaissance',
            description: 'Port scanning activity detected on multiple ports.',
            actionTaken: 'Aucune action',
            status: 'En attente'
        },
        { 
            id: 5, 
            severity: 'medium', 
            message: 'Pattern IDS matché', 
            source: '192.168.1.156', 
            time: 'Il y a 45 min',
            timestamp: '2024-08-28 10:42:00',
            device: 'Mobile-User-05',
            browser: 'Safari 17.0',
            os: 'iOS 17',
            location: 'Nice, France',
            ruleId: 'IDS-005',
            category: 'Malware',
            description: 'Known malware signature detected in network traffic.',
            actionTaken: 'Appareil isolé',
            status: 'Résolu'
        },
        { 
            id: 6, 
            severity: 'critical', 
            message: 'Injection SQL détectée', 
            source: '192.168.1.99', 
            time: 'Il y a 1 heure',
            timestamp: '2024-08-28 10:27:00',
            device: 'Server-DB-02',
            browser: 'N/A',
            os: 'Debian 11',
            location: 'Toulouse, France',
            ruleId: 'IDS-006',
            category: 'Injection',
            description: 'SQL injection attempt detected in HTTP request.',
            actionTaken: 'Requête bloquée',
            status: 'En cours'
        },
        { 
            id: 7, 
            severity: 'high', 
            message: 'Téléchargement suspect', 
            source: '192.168.1.33', 
            time: 'Il y a 2 heures',
            timestamp: '2024-08-28 09:27:00',
            device: 'Laptop-User-07',
            browser: 'Edge 120.0',
            os: 'Windows 10',
            location: 'Nantes, France',
            ruleId: 'IDS-007',
            category: 'Data Exfiltration',
            description: 'Large file download from unknown source detected.',
            actionTaken: 'Téléchargement bloqué',
            status: 'Résolu'
        },
        { 
            id: 8, 
            severity: 'low', 
            message: 'Accès non autorisé', 
            source: '192.168.1.67', 
            time: 'Il y a 3 heures',
            timestamp: '2024-08-28 08:27:00',
            device: 'Tablet-User-02',
            browser: 'Chrome 120.0',
            os: 'Android 14',
            location: 'Strasbourg, France',
            ruleId: 'IDS-008',
            category: 'Access Control',
            description: 'Attempt to access restricted resource without proper permissions.',
            actionTaken: 'Accès refusé',
            status: 'Résolu'
        },
    ]

    const filteredAlerts = alerts.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'critical' && item.severity === 'critical') ||
            (filter === 'high' && item.severity === 'high') ||
            (filter === 'pending' && item.status === 'En attente')
        
        return matchesFilter
    })

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
                            Toutes les alertes
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'critical' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('critical')}
                        >
                            Critiques
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'high' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('high')}
                        >
                            Hautes
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'pending' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('pending')}
                        >
                            En attente
                        </button>
                    </div>
                </div>
            </div>


            {/* Alerts Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Sévérité</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Message</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Source IP</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Appareil</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Heure</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {getSeverityBadge(alert.severity)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{alert.message}</h4>
                                            <p className="text-sm text-gray-500">{alert.category}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{alert.source}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{alert.device}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">{alert.time}</span>
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
                                    <h4 className="font-semibold text-gray-900">{selectedAlert.message}</h4>
                                    <p className="text-sm text-gray-500">{selectedAlert.category}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                                    <p className="text-gray-900 font-medium">{selectedAlert.source}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Appareil</label>
                                    <p className="text-gray-900">{selectedAlert.device}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Navigateur</label>
                                    <p className="text-gray-900">{selectedAlert.browser}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Système d'exploitation</label>
                                    <p className="text-gray-900">{selectedAlert.os}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                                    <p className="text-gray-900">{selectedAlert.location}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horodatage</label>
                                    <p className="text-gray-900">{selectedAlert.timestamp}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Règle IDS</label>
                                    <p className="text-gray-900">{selectedAlert.ruleId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Action prise</label>
                                    <p className="text-gray-900">{selectedAlert.actionTaken}</p>
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
