import { useState } from 'react'
import Button from '../../../components/ui/button'
import { sqlInjectionSimulation } from '../../../services/simulation.js'

export default function SQLInjection() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    const commonSQLPayloads = [
        "' OR '1'='1",
        "' OR 1=1--",
        "' UNION SELECT * FROM users--",
        "admin'--",
        "' DROP TABLE users--",
        "1' OR '1'='1'--"
    ]

    const handleSearch = async (searchQuery) => {
        setIsLoading(true)
        try {
            const response = await sqlInjectionSimulation({ query: searchQuery })
            setLastResult(response)

            if (response.results && response.results.length > 0) {
                setResults([{
                    id: results.length + 1,
                    query: searchQuery,
                    detected: response.detected,
                    results: response.results,
                    message: response.message,
                    timestamp: new Date().toLocaleTimeString()
                }, ...results])
            }
        } catch (error) {
            setLastResult({
                success: false,
                message: 'Erreur lors de la simulation'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            handleSearch(query)
        }
    }

    const usePayload = (payload) => {
        setQuery(payload)
        handleSearch(payload)
    }

    const resetSimulation = () => {
        setResults([])
        setQuery('')
        setLastResult(null)
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Injection SQL</h1>
                    <p className="text-gray-600">
                        Simulez une attaque par injection SQL dans un formulaire de recherche.
                        Apprenez comment les hackers peuvent exfiltrer des données sensibles.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Search Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formulaire de recherche (vulnérable)</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un utilisateur</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ex: admin, user1..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Essayez d'injecter du code SQL pour voir toutes les données
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isLoading || !query.trim()}
                                className="w-full"
                            >
                                {isLoading ? 'Recherche en cours...' : 'Rechercher'}
                            </Button>
                        </form>

                        {/* Common Payloads */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Payloads SQL courants</h3>
                            <div className="space-y-2">
                                {commonSQLPayloads.map((payload, index) => (
                                    <button
                                        key={index}
                                        onClick={() => usePayload(payload)}
                                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-mono text-gray-700 transition-colors"
                                    >
                                        {payload}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {lastResult && (
                            <div className={`mt-4 p-4 rounded-lg ${
                                lastResult.detected
                                    ? 'bg-yellow-50 border border-yellow-200'
                                    : 'bg-green-50 border border-green-200'
                            }`}>
                                <p className={`text-sm font-medium ${
                                    lastResult.detected ? 'text-yellow-800' : 'text-green-800'
                                }`}>
                                    {lastResult.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Résultats</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        {results.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Aucune recherche effectuée</p>
                                <p className="text-gray-400 text-sm mt-1">Entrez une requête pour voir les résultats</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {results.map((result) => (
                                    <div
                                        key={result.id}
                                        className={`p-4 rounded-lg border ${
                                            result.detected
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-blue-50 border-blue-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{result.id}
                                            </span>
                                            <span className="text-xs text-gray-500">{result.timestamp}</span>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Requête:</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                                                {result.query}
                                            </code>
                                        </div>
                                        {result.detected && (
                                            <div className="mt-2 p-2 bg-red-50 rounded">
                                                <p className="text-xs text-red-700 font-medium mb-1">
                                                    ⚠️ Injection SQL détectée - Données exposées:
                                                </p>
                                                <div className="space-y-1">
                                                    {result.results.map((user, idx) => (
                                                        <div key={idx} className="text-xs text-red-600 font-mono">
                                                            {user.username} ({user.email}) - {user.role}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {!result.detected && result.results.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">Résultats normaux:</p>
                                                {result.results.map((user, idx) => (
                                                    <div key={idx} className="text-xs text-gray-700">
                                                        {user.username} ({user.email})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
