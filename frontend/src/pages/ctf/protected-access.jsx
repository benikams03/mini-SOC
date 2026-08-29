import { useState } from 'react'
import Button from '../../components/ui/button'

export default function ProtectedAccess() {
    const [url, setUrl] = useState('/admin/dashboard')
    const [method, setMethod] = useState('GET')
    const [headers, setHeaders] = useState('')
    const [attempts, setAttempts] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showHint, setShowHint] = useState(false)

    const handleRequest = () => {
        const result = {
            id: attempts.length + 1,
            url,
            method,
            status: isAuthenticated ? 'success' : 'unauthorized',
            statusCode: isAuthenticated ? 200 : 401,
            timestamp: new Date().toLocaleTimeString(),
            headers: headers || 'Aucun header personnalisé'
        }
        setAttempts([result, ...attempts])
    }

    const handleDirectAccess = () => {
        setUrl('/admin/dashboard')
        setMethod('GET')
        handleRequest()
    }

    const handleWithToken = () => {
        setUrl('/admin/dashboard')
        setMethod('GET')
        setHeaders('Authorization: Bearer fake_token_12345')
        setIsAuthenticated(true)
        handleRequest()
    }

    const handleWithCookie = () => {
        setUrl('/admin/dashboard')
        setMethod('GET')
        setHeaders('Cookie: session_id=abc123xyz')
        setIsAuthenticated(true)
        handleRequest()
    }

    const resetSimulation = () => {
        setAttempts([])
        setIsAuthenticated(false)
        setUrl('/admin/dashboard')
        setMethod('GET')
        setHeaders('')
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès Page Protégée</h1>
                    <p className="text-gray-600">
                        Tentez d'accéder à une page protégée sans autorisation. 
                        Comprenez les mécanismes de contrôle d'accès et d'authentification.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration de la requête</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="/admin/dashboard"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode HTTP</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Headers (optionnel)</label>
                                <textarea
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                    placeholder="Authorization: Bearer token"
                                    rows3
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <Button 
                                variant="primary" 
                                onClick={handleRequest}
                                className="w-full"
                            >
                                Envoyer la requête
                            </Button>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Actions rapides</h3>
                            <div className="space-y-2">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleDirectAccess}
                                    className="w-full"
                                >
                                    Accès direct (sans auth)
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleWithToken}
                                    className="w-full"
                                >
                                    Avec token Bearer
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleWithCookie}
                                    className="w-full"
                                >
                                    Avec cookie de session
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Réponse</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        {attempts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">Aucune requête envoyée</p>
                                <p className="text-sm text-gray-400">
                                    Configurez et envoyez une requête pour voir la réponse
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attempts.map((attempt) => (
                                    <div 
                                        key={attempt.id}
                                        className={`p-4 rounded-lg border ${
                                            attempt.status === 'success' 
                                                ? 'bg-green-50 border-green-200' 
                                                : 'bg-red-50 border-red-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{attempt.id} - {attempt.method} {attempt.url}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                attempt.status === 'success' 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : 'bg-red-200 text-red-800'
                                            }`}>
                                                {attempt.statusCode}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 mb-2">
                                            {attempt.timestamp}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium mb-1">Headers:</p>
                                            <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                                                {attempt.headers}
                                            </p>
                                        </div>
                                        <div className={`mt-2 text-sm font-medium ${
                                            attempt.status === 'success' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {attempt.status === 'success' 
                                                ? '✓ Accès autorisé - Contenu de la page' 
                                                : '✗ Accès refusé - Authentification requise'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hint Toggle */}
                <div className="mt-6">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        {showHint ? 'Masquer l\'indice' : 'Afficher un indice'}
                    </button>
                    
                    {showHint && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Indice</h3>
                            <p className="text-sm text-gray-600">
                                Les pages protégées nécessitent une authentification. Les méthodes courantes 
                                incluent les tokens Bearer dans les headers, les cookies de session, ou 
                                l'authentification basique. Essayez d'ajouter un header d'autorisation valide 
                                pour accéder à la page.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Objectif pédagogique</h3>
                    <p className="text-sm text-gray-600">
                        Cette simulation illustre le fonctionnement du contrôle d'accès. 
                        Les systèmes modernes utilisent divers mécanismes d'authentification : 
                        JWT (JSON Web Tokens), sessions basées sur des cookies, OAuth, etc. 
                        Les IDS surveillent les tentatives d'accès non autorisées et peuvent 
                        bloquer les adresses IP qui effectuent trop de requêtes échouées.
                    </p>
                </div>
            </div>
        </div>
    )
}
