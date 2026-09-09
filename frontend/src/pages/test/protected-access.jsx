import { useState } from 'react'
import Button from '../../components/ui/button'
import axios from 'axios'

// Configuration de l'API - changer cette URL pour utiliser l'API en ligne ou locale
const API_BASE_URL = 'https://mini-soc-oerx.onrender.com/api/v1'
// const API_BASE_URL = 'http://localhost:5050/api/v1'

// Créer une instance axios sans interceptor pour cette simulation
const simulationApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default function ProtectedAccess() {
    const [url, setUrl] = useState(`${API_BASE_URL}/alerts`)
    const [method, setMethod] = useState('GET')
    const [token, setToken] = useState('')
    const [attempts, setAttempts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleRequest = async () => {
        setIsLoading(true)
        
        try {
            const cleanUrl = url.replace(API_BASE_URL, '')
            const headers = {}
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
            
            let response
            if (method === 'GET') {
                response = await simulationApi.get(cleanUrl, { headers })
            } else if (method === 'POST') {
                response = await simulationApi.post(cleanUrl, {}, { headers })
            } else if (method === 'PUT') {
                response = await simulationApi.put(cleanUrl, {}, { headers })
            } else if (method === 'DELETE') {
                response = await simulationApi.delete(cleanUrl, { headers })
            }
            
            const result = {
                id: attempts.length + 1,
                url,
                method,
                status: 'success',
                statusCode: response.status,
                timestamp: new Date().toLocaleTimeString(),
                token: token || 'Aucun token',
                message: 'Accès autorisé'
            }
            setAttempts([result, ...attempts])
            
        } catch (error) {
            const result = {
                id: attempts.length + 1,
                url,
                method,
                status: 'unauthorized',
                statusCode: error.response?.status || 401,
                timestamp: new Date().toLocaleTimeString(),
                token: token || 'Aucun token',
                message: error.response?.data?.message || 'Erreur d\'authentification'
            }
            setAttempts([result, ...attempts])
        } finally {
            setIsLoading(false)
        }
    }

    const resetSimulation = () => {
        setAttempts([])
        setUrl('http://localhost:5050/api/v1/dashboard')
        setMethod('GET')
        setToken('')
    }

    return (
        <div className="p-4">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Token JWT (optionnel)</label>
                                <input
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Entrez votre token JWT"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Le token sera automatiquement ajouté au header Authorization: Bearer
                                </p>
                            </div>

                            <Button 
                                variant="primary" 
                                onClick={handleRequest}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Envoi en cours...' : 'Envoyer la requête'}
                            </Button>
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
                                            <p className="font-medium mb-1">Token:</p>
                                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                                                {attempt.token}
                                            </p>
                                        </div>
                                        <div className={`mt-2 text-sm font-medium ${
                                            attempt.status === 'success' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {attempt.status === 'success' 
                                                ? '✓ Accès autorisé - ' + attempt.message
                                                : '✗ Accès refusé - ' + attempt.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
