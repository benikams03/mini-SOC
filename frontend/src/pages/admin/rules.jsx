import { useState } from 'react'
import { Filter, Eye, Settings, AlertTriangle, Shield, Clock, Power, PowerOff } from 'lucide-react'

export default function Rules() {
    const [selectedRule, setSelectedRule] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')

    const rules = [
        { 
            id: 'IDS-001', 
            name: 'Brute Force Login', 
            category: 'Authentification',
            severity: 'critical',
            status: 'active',
            created: '2024-08-15',
            description: 'Détecte plusieurs tentatives de connexion échouées depuis la même adresse IP sur une courte période.',
            action: 'Bloquer temporairement l\'IP et générer une alerte',
            plugin: '@fastify/rate-limit'
        },
        { 
            id: 'IDS-002', 
            name: 'Trop de requêtes', 
            category: 'DoS / Abus API',
            severity: 'critical',
            status: 'active',
            created: '2024-08-16',
            description: 'Identifie des taux de requêtes excessifs provenant d\'une seule source.',
            action: 'Limiter les requêtes et bloquer temporairement la source',
            plugin: '@fastify/rate-limit'
        },
        { 
            id: 'IDS-003', 
            name: 'Accès non autorisé', 
            category: 'Authorization',
            severity: 'high',
            status: 'active',
            created: '2024-08-17',
            description: 'Détecte les tentatives d\'accès aux ressources sans autorisation appropriée.',
            action: 'Refuser l\'accès et journaliser l\'événement',
            plugin: '@fastify/jwt'
        },
        { 
            id: 'IDS-004', 
            name: 'Tentative SQL Injection', 
            category: 'Injection',
            severity: 'critical',
            status: 'active',
            created: '2024-08-18',
            description: 'Identifie les tentatives d\'injection SQL dans les requêtes HTTP et les paramètres de requête.',
            action: 'Bloquer la requête et générer une alerte critique',
            plugin: 'validator + règles personnalisées'
        },
        { 
            id: 'IDS-005', 
            name: 'Tentative XSS', 
            category: 'Web Attack',
            severity: 'high',
            status: 'active',
            created: '2024-08-19',
            description: 'Détecte les tentatives de Cross-Site Scripting dans les entrées utilisateur.',
            action: 'Nettoyer/rejeter l\'entrée et journaliser',
            plugin: 'validator / sanitize-html'
        },
        { 
            id: 'IDS-006', 
            name: 'IP suspecte', 
            category: 'Réseau',
            severity: 'high',
            status: 'active',
            created: '2024-08-20',
            description: 'Détecte les adresses IP provenant de sources malveillantes connues ou présentant un comportement suspect.',
            action: 'Bloquer l\'IP et créer une alerte',
            plugin: 'Règle personnalisée'
        },
        { 
            id: 'IDS-007', 
            name: 'User-Agent suspect', 
            category: 'Reconnaissance',
            severity: 'medium',
            status: 'active',
            created: '2024-08-21',
            description: 'Identifie les chaînes user-agent suspectes ou automatisées indiquant des outils de reconnaissance.',
            action: 'Journaliser et générer une alerte',
            plugin: 'Règle personnalisée'
        },
        { 
            id: 'IDS-008', 
            name: 'Accès à une route sensible', 
            category: 'Reconnaissance',
            severity: 'high',
            status: 'active',
            created: '2024-08-22',
            description: 'Détecte les tentatives d\'accès aux routes administratives sensibles ou protégées.',
            action: 'Refuser l\'accès et alerter l\'administrateur',
            plugin: 'Règle personnalisée'
        },
        { 
            id: 'IDS-009', 
            name: 'Multiples erreurs 404', 
            category: 'Reconnaissance',
            severity: 'medium',
            status: 'active',
            created: '2024-08-23',
            description: 'Détecte plusieurs erreurs 404 depuis la même IP indiquant un balayage de chemins ou une énumération.',
            action: 'Déclencher une alerte et surveiller l\'IP',
            plugin: 'Règle personnalisée'
        },
        { 
            id: 'IDS-010', 
            name: 'Connexion inhabituelle', 
            category: 'Authentification',
            severity: 'medium',
            status: 'active',
            created: '2024-08-24',
            description: 'Détecte les tentatives de connexion depuis des lieux, heures ou appareils inhabituels.',
            action: 'Demander une vérification MFA et journaliser',
            plugin: 'Règle personnalisée'
        },
        { 
            id: 'IDS-011', 
            name: 'Token JWT invalide', 
            category: 'Authentification',
            severity: 'high',
            status: 'active',
            created: '2024-08-25',
            description: 'Détecte les tentatives d\'utilisation de tokens JWT invalides, expirés ou falsifiés.',
            action: 'Refuser la requête et enregistrer l\'événement',
            plugin: '@fastify/jwt'
        },
        { 
            id: 'IDS-012', 
            name: 'Modification de données sensible', 
            category: 'Integrity',
            severity: 'critical',
            status: 'active',
            created: '2024-08-26',
            description: 'Détecte les modifications non autorisées de données sensibles ou de fichiers de configuration.',
            action: 'Bloquer/confirmer l\'opération et générer une alerte critique',
            plugin: 'Règle personnalisée'
        },
    ]

    const filteredRules = rules.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'active' && item.status === 'active') ||
            (filter === 'inactive' && item.status === 'inactive') ||
            (filter === 'critical' && item.severity === 'critical') ||
            (filter === 'high' && item.severity === 'high') ||
            (filter === 'medium' && item.severity === 'medium')
        
        return matchesFilter
    })

    const getSeverityBadge = (severity) => {
        const styles = {
            critical: 'bg-red-100 text-red-700',
            high: 'bg-orange-100 text-orange-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-blue-100 text-blue-700'
        }
        const labels = {
            critical: 'CRITIQUE',
            high: 'ÉLEVÉ',
            medium: 'MOYEN',
            low: 'FAIBLE'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
                {labels[severity]}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                    {selectedRule.action}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plugin / package</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg font-mono text-sm">
                                    {selectedRule.plugin}
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
