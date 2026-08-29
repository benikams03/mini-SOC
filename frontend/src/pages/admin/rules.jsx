import { useState } from 'react'
import { Filter, Eye, Settings, AlertTriangle, Shield, Clock, Power, PowerOff } from 'lucide-react'

export default function Rules() {
    const [selectedRule, setSelectedRule] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')

    const rules = [
        { 
            id: 'IDS-001', 
            name: 'Brute Force Detection', 
            category: 'Authentication',
            severity: 'critical',
            status: 'active',
            created: '2024-08-15',
            description: 'Detects multiple failed login attempts from the same IP address within a short time period.',
            pattern: 'failed_login_count > 5 AND time_window < 60s',
            action: 'block_ip_temporarily'
        },
        { 
            id: 'IDS-002', 
            name: 'SQL Injection Pattern', 
            category: 'Injection',
            severity: 'critical',
            status: 'active',
            created: '2024-08-16',
            description: 'Identifies SQL injection attempts in HTTP requests and query parameters.',
            pattern: 'SELECT.*FROM|UNION.*SELECT|DROP.*TABLE',
            action: 'block_request'
        },
        { 
            id: 'IDS-003', 
            name: 'DDoS Detection', 
            category: 'Network',
            severity: 'high',
            status: 'active',
            created: '2024-08-17',
            description: 'Monitors traffic patterns to detect potential DDoS attack preparation.',
            pattern: 'request_rate > 1000/min',
            action: 'rate_limit'
        },
        { 
            id: 'IDS-004', 
            name: 'Port Scanning', 
            category: 'Reconnaissance',
            severity: 'medium',
            status: 'active',
            created: '2024-08-18',
            description: 'Detects port scanning activities across multiple ports.',
            pattern: 'unique_ports_accessed > 20',
            action: 'log_only'
        },
        { 
            id: 'IDS-005', 
            name: 'Malware Signature', 
            category: 'Malware',
            severity: 'high',
            status: 'active',
            created: '2024-08-19',
            description: 'Matches known malware signatures in network traffic.',
            pattern: 'known_malware_hash',
            action: 'isolate_device'
        },
        { 
            id: 'IDS-006', 
            name: 'XSS Attack', 
            category: 'Injection',
            severity: 'high',
            status: 'inactive',
            created: '2024-08-20',
            description: 'Detects Cross-Site Scripting attempts in user inputs.',
            pattern: '<script>|javascript:|onerror=',
            action: 'sanitize_input'
        },
        { 
            id: 'IDS-007', 
            name: 'Data Exfiltration', 
            category: 'Data Loss',
            severity: 'critical',
            status: 'active',
            created: '2024-08-21',
            description: 'Monitors for large data transfers to unknown destinations.',
            pattern: 'data_transfer > 1GB AND unknown_destination',
            action: 'block_transfer'
        },
        { 
            id: 'IDS-008', 
            name: 'Unauthorized Access', 
            category: 'Access Control',
            severity: 'medium',
            status: 'inactive',
            created: '2024-08-22',
            description: 'Detects attempts to access restricted resources without proper permissions.',
            pattern: 'access_denied_count > 3',
            action: 'alert_admin'
        },
    ]

    const filteredRules = rules.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'active' && item.status === 'active') ||
            (filter === 'inactive' && item.status === 'inactive') ||
            (filter === 'critical' && item.severity === 'critical') ||
            (filter === 'high' && item.severity === 'high')
        
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

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-700'
        }
        const icons = {
            active: Power,
            inactive: PowerOff
        }
        const Icon = icons[status]
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                <Icon className="w-3 h-3" />
                {status === 'active' ? 'Active' : 'Inactive'}
            </span>
        )
    }

    const handleViewDetails = (rule) => {
        setSelectedRule(rule)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedRule(null)
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Règles IDS</h2>
                    <p className="text-sm text-gray-600 mt-1">Gérez les règles de détection d'intrusion</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{rules.length} règles</span>
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
                            Toutes les règles
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'active' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('active')}
                        >
                            Actives
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'inactive' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('inactive')}
                        >
                            Inactives
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
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total règles</p>
                            <p className="text-xl font-bold text-gray-900">{rules.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Power className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Actives</p>
                            <p className="text-xl font-bold text-gray-900">
                                {rules.filter(r => r.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Critiques</p>
                            <p className="text-xl font-bold text-gray-900">
                                {rules.filter(r => r.severity === 'critical').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rules Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Catégorie</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Sévérité</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Créée le</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-900">{rule.id}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{rule.name}</h4>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{rule.category}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getSeverityBadge(rule.severity)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(rule.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">{rule.created}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => handleViewDetails(rule)}
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
                    {filteredRules.length === 0 && (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <Settings className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-gray-600">Aucune règle trouvée</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rule Details Modal */}
            {isModalOpen && selectedRule && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                    <div className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-5">Détails de la règle</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedRule.id} - {selectedRule.name}</h4>
                                    <p className="text-sm text-gray-500">{selectedRule.category}</p>
                                </div>
                                <div className="ml-auto">
                                    {getSeverityBadge(selectedRule.severity)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <div>{getStatusBadge(selectedRule.status)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Créée le</label>
                                    <p className="text-gray-900">{selectedRule.created}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {selectedRule.description}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pattern de détection</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg font-mono text-sm">
                                    {selectedRule.pattern}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                    {selectedRule.action}
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
