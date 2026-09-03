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

export default function CTFIndex() {
    const scenarios = [
        {
            id: 'login',
            name: 'Attaque par force brute',
            description: 'Simulez une attaque par force brute sur un formulaire de connexion. Apprenez à détecter et bloquer ce type d\'attaque.',
            icon: Terminal,
            path: '/ctf/login-attack',
            difficulty: 'Facile',
            category: 'Authentification'
        },
        {
            id: 'protected',
            name: 'Accès page protégée',
            description: 'Tentez d\'accéder à une page protégée sans autorisation. Comprenez les mécanismes de contrôle d\'accès.',
            icon: Lock,
            path: '/ctf/protected-access',
            difficulty: 'Moyen',
            category: 'Autorisation'
        },
        {
            id: 'ddos',
            name: 'Requêtes simultanées',
            description: 'Simulez une attaque par déni de service en envoyant de multiples requêtes simultanées.',
            icon: Activity,
            path: '/ctf/ddos',
            difficulty: 'Difficile',
            category: 'Réseau'
        },
        {
            id: 'xss',
            name: 'Injection XSS',
            description: 'Exploitez une vulnérabilité XSS pour injecter du code malveillant dans une application web.',
            icon: Globe,
            path: '/ctf/xss',
            difficulty: 'Moyen',
            category: 'Injection'
        },
        {
            id: 'sqli',
            name: 'Injection SQL',
            description: 'Découvrez et exploitez des vulnérabilités d\'injection SQL dans une base de données.',
            icon: Database,
            path: '/ctf/sqli',
            difficulty: 'Difficile',
            category: 'Injection'
        },
        {
            id: 'recon',
            name: 'Reconnaissance',
            description: 'Effectuez une reconnaissance passive et active sur une cible pour identifier des informations sensibles.',
            icon: Shield,
            path: '/ctf/reconnaissance',
            difficulty: 'Facile',
            category: 'Reconnaissance'
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

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Environnement de formation</h3>
                            <p className="text-sm text-gray-600">
                                Ces simulations sont conçues uniquement à des fins éducatives. Elles vous permettent de comprendre 
                                les vecteurs d'attaque dans un environnement contrôlé et sécurisé. Toute tentative d'utilisation 
                                de ces techniques sur des systèmes non autorisés est illégale.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
