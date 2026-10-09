import { Link } from 'react-router-dom'
import {
    Terminal,
    Lock,
    Activity,
    Shield,
    Globe,
    Database,
    ArrowRight,
    Play
} from 'lucide-react'

export default function SimulationsIndex() {
    const scenarios = [
        {
            id: 'login',
            name: 'Attaque par force brute',
            description: 'Simulez une attaque par force brute sur un formulaire de connexion. Apprenez à détecter et bloquer ce type d\'attaque.',
            icon: Terminal,
            path: '/admin/simulations/login-attack',
            difficulty: 'Facile',
            category: 'Authentification'
        },
        {
            id: 'protected',
            name: 'Accès page protégée',
            description: 'Tentez d\'accéder à une page protégée sans autorisation. Comprenez les mécanismes de contrôle d\'accès.',
            icon: Lock,
            path: '/admin/simulations/protected-access',
            difficulty: 'Moyen',
            category: 'Autorisation'
        },
        {
            id: 'ddos',
            name: 'Requêtes simultanées',
            description: 'Simulez une attaque par déni de service en envoyant de multiples requêtes simultanées.',
            icon: Activity,
            path: '/admin/simulations/ddos',
            difficulty: 'Difficile',
            category: 'Réseau'
        },
        {
            id: 'sql',
            name: 'Injection SQL',
            description: 'Exploitez une vulnérabilité SQL pour exfiltrer des données sensibles de la base de données.',
            icon: Database,
            path: '/admin/simulations/sql-injection',
            difficulty: 'Difficile',
            category: 'Injection'
        },
        {
            id: 'xss',
            name: 'Cross-Site Scripting',
            description: 'Injectez du code JavaScript malveillant dans un formulaire pour compromettre les utilisateurs.',
            icon: Globe,
            path: '/admin/simulations/xss',
            difficulty: 'Moyen',
            category: 'Injection'
        },
        {
            id: 'path',
            name: 'Path Traversal',
            description: 'Accédez aux fichiers système en contournant les restrictions de chemin de fichiers.',
            icon: Shield,
            path: '/admin/simulations/path-traversal',
            difficulty: 'Moyen',
            category: 'Système'
        },
    ]

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Facile':
                return 'bg-green-100 text-green-700'
            case 'Moyen':
                return 'bg-yellow-100 text-yellow-700'
            case 'Difficile':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="p-4">
            <div className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulations de Sécurité</h1>
                    <p className="text-gray-600">
                        Sélectionnez un scénario pour commencer l'entraînement. Chaque simulation vous permet de comprendre
                        et d'expérimenter différentes techniques d'attaque et de défense.
                    </p>
                </div>

                {/* Scenarios Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon
                        return (
                            <Link
                                key={scenario.id}
                                to={scenario.path}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                        <Icon className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                                        {scenario.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                    {scenario.name}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                    {scenario.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{scenario.category}</span>
                                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                                        <span className="text-sm font-medium">Commencer</span>
                                        <Play className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>


            </div>
        </div>
    )
}
