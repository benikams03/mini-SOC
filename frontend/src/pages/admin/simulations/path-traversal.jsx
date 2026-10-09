import { useState } from 'react'
import Button from '../../../components/ui/button'
import { pathTraversalSimulation } from '../../../services/simulation.js'

export default function PathTraversal() {
    const [filename, setFilename] = useState('')
    const [attempts, setAttempts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    const commonTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '..%2F..%2F..%2Fetc%2Fpasswd',
        '%2e%2e%2fetc%2fpasswd',
        '/etc/passwd',
        'C:\\Windows\\System32',
        '....//....//....//etc/passwd',
        '..%5c..%5c..%5cwindows%5csystem32'
    ]

    const allowedFiles = [
        'readme.txt',
        'about.txt',
        'contact.txt',
        'services.txt'
    ]

    const handleAccess = async (file) => {
        setIsLoading(true)
        try {
            const response = await pathTraversalSimulation({ filename: file })
            setLastResult(response)

            setAttempts([{
                id: attempts.length + 1,
                filename: file,
                detected: response.detected,
                result: response.result,
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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (filename.trim()) {
            handleAccess(filename)
        }
    }

    const usePayload = (payload) => {
        setFilename(payload)
        handleAccess(payload)
    }

    const resetSimulation = () => {
        setAttempts([])
        setFilename('')
        setLastResult(null)
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Path Traversal</h1>
                    <p className="text-gray-600">
                        Simulez une attaque par path traversal pour accéder aux fichiers système.
                        Apprenez comment les attaquants peuvent lire des fichiers sensibles.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Access Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès aux fichiers</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier</label>
                                <input
                                    type="text"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    placeholder="Ex: readme.txt"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Fichiers autorisés: {allowedFiles.join(', ')}
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !filename.trim()}
                                className="w-full"
                            >
                                {isLoading ? 'Accès en cours...' : 'Accéder au fichier'}
                            </Button>
                        </form>

                        {/* Common Payloads */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Payloads Path Traversal courants</h3>
                            <div className="space-y-2">
                                {commonTraversalPayloads.map((payload, index) => (
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
                                    : lastResult.result?.error
                                    ? 'bg-red-50 border border-red-200'
                                    : 'bg-green-50 border border-green-200'
                            }`}>
                                <p className={`text-sm font-medium ${
                                    lastResult.detected
                                        ? 'text-yellow-800'
                                        : lastResult.result?.error
                                        ? 'text-red-800'
                                        : 'text-green-800'
                                }`}>
                                    {lastResult.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Journal d'accès</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        {attempts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Aucune tentative d'accès</p>
                                <p className="text-gray-400 text-sm mt-1">Entrez un nom de fichier pour voir le résultat</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {attempts.map((attempt) => (
                                    <div
                                        key={attempt.id}
                                        className={`p-4 rounded-lg border ${
                                            attempt.detected
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : attempt.result?.error
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-green-50 border-green-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{attempt.id}
                                            </span>
                                            <span className="text-xs text-gray-500">{attempt.timestamp}</span>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Fichier demandé:</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all block">
                                                {attempt.filename}
                                            </code>
                                        </div>

                                        {attempt.detected && (
                                            <div className="mt-2 p-2 bg-red-50 rounded">
                                                <p className="text-xs text-red-700 font-medium mb-1">
                                                    ⚠️ Path Traversal détecté - Accès bloqué
                                                </p>
                                                {attempt.result?.warning && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        {attempt.result.warning}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {!attempt.detected && attempt.result?.content && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500 mb-1">Contenu du fichier:</p>
                                                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                                                    {attempt.result.content}
                                                </div>
                                            </div>
                                        )}

                                        {!attempt.detected && attempt.result?.error && (
                                            <div className="mt-2">
                                                <p className="text-xs text-red-600">
                                                    {attempt.result.error}
                                                </p>
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
