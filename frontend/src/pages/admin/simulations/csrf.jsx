import { useState } from 'react'
import Button from '../../../components/ui/button'
import { csrfSimulation } from '../../../services/simulation.js'

export default function CSRF() {
    const [action, setAction] = useState('')
    const [data, setData] = useState('')
    const [attempts, setAttempts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    const commonActions = [
        { action: 'change_password', data: 'newpassword123', description: 'Changer le mot de passe' },
        { action: 'delete_account', data: 'user_id', description: 'Supprimer un compte' },
        { action: 'transfer_money', data: 'amount=1000&to=attacker', description: 'Transférer de l\'argent' },
        { action: 'update_email', data: 'hacker@evil.com', description: 'Changer l\'email' }
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (action.trim()) {
            setIsLoading(true)
            try {
                const response = await csrfSimulation({ action, data })
                setLastResult(response)

                setAttempts([{
                    id: attempts.length + 1,
                    action,
                    data,
                    detected: response.detected,
                    message: response.message,
                    timestamp: new Date().toLocaleTimeString()
                }, ...attempts])
            } catch (error) {
                setLastResult({
                    success: false,
                    message: 'Erreur lors de la simulation'
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    const usePreset = (preset) => {
        setAction(preset.action)
        setData(preset.data)
    }

    const resetSimulation = () => {
        setAttempts([])
        setAction('')
        setData('')
        setLastResult(null)
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross-Site Request Forgery (CSRF)</h1>
                    <p className="text-gray-600">
                        Simulez une attaque CSRF qui force un utilisateur authentifié à exécuter des actions non désirées.
                        Apprenez comment les tokens CSRF protègent contre ce type d'attaque.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Action Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formulaire d'action (sans token CSRF)</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                <input
                                    type="text"
                                    value={action}
                                    onChange={(e) => setAction(e.target.value)}
                                    placeholder="Ex: change_password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Données</label>
                                <input
                                    type="text"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    placeholder="Paramètres de l'action"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !action.trim()}
                                className="w-full"
                            >
                                {isLoading ? 'Exécution en cours...' : 'Exécuter l\'action'}
                            </Button>
                        </form>

                        {/* Common Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Actions courantes à simuler</h3>
                            <div className="space-y-2">
                                {commonActions.map((preset, index) => (
                                    <button
                                        key={index}
                                        onClick={() => usePreset(preset)}
                                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                                    >
                                        <div className="font-medium text-gray-900">{preset.description}</div>
                                        <div className="text-xs text-gray-500">{preset.action}</div>
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
                                {lastResult.warning && (
                                    <p className="text-xs text-yellow-700 mt-2">{lastResult.warning}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Journal d'actions</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        {attempts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Aucune action exécutée</p>
                                <p className="text-gray-400 text-sm mt-1">Exécutez une action pour voir le résultat</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {attempts.map((attempt) => (
                                    <div
                                        key={attempt.id}
                                        className={`p-4 rounded-lg border ${
                                            attempt.detected
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-blue-50 border-blue-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{attempt.id}
                                            </span>
                                            <span className="text-xs text-gray-500">{attempt.timestamp}</span>
                                        </div>

                                        {attempt.detected && (
                                            <div className="mb-2 p-2 bg-red-50 rounded">
                                                <p className="text-xs text-red-700 font-medium">
                                                    ⚠️ CSRF détecté - Requête sans token CSRF
                                                </p>
                                            </div>
                                        )}

                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Action:</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all block">
                                                {attempt.action}
                                            </code>
                                        </div>

                                        {attempt.data && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Données:</p>
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all block">
                                                    {attempt.data}
                                                </code>
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
