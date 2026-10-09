import { useState } from 'react'
import Button from '../../../components/ui/button'
import { xssSimulation } from '../../../services/simulation.js'

export default function XSS() {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    const commonXSSPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<iframe src="javascript:alert(\'XSS\')">',
        'javascript:alert("XSS")',
        '<body onload=alert("XSS")>',
        '<svg onload=alert("XSS")>'
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment.trim()) {
            setIsLoading(true)
            try {
                const response = await xssSimulation({ comment })
                setLastResult(response)

                if (response.success) {
                    setComments([{
                        id: comments.length + 1,
                        original: response.original,
                        sanitized: response.sanitized,
                        detected: response.detected,
                        message: response.message,
                        timestamp: new Date().toLocaleTimeString()
                    }, ...comments])
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
    }

    const usePayload = (payload) => {
        setComment(payload)
    }

    const resetSimulation = () => {
        setComments([])
        setComment('')
        setLastResult(null)
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross-Site Scripting (XSS)</h1>
                    <p className="text-gray-600">
                        Simulez une attaque XSS en injectant du code malveillant dans un formulaire de commentaires.
                        Apprenez comment les attaques XSS peuvent compromettre les utilisateurs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Comment Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formulaire de commentaires</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Votre commentaire</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Laissez un commentaire..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Essayez d'injecter du code JavaScript malveillant
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !comment.trim()}
                                className="w-full"
                            >
                                {isLoading ? 'Envoi en cours...' : 'Publier le commentaire'}
                            </Button>
                        </form>

                        {/* Common Payloads */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Payloads XSS courants</h3>
                            <div className="space-y-2">
                                {commonXSSPayloads.map((payload, index) => (
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

                    {/* Comments Display */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Commentaires</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        {comments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">Aucun commentaire</p>
                                <p className="text-gray-400 text-sm mt-1">Publiez un commentaire pour voir le résultat</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {comments.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-lg border ${
                                            item.detected
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-blue-50 border-blue-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{item.id}
                                            </span>
                                            <span className="text-xs text-gray-500">{item.timestamp}</span>
                                        </div>

                                        {item.detected && (
                                            <div className="mb-3 p-2 bg-red-50 rounded">
                                                <p className="text-xs text-red-700 font-medium mb-1">
                                                    ⚠️ XSS détecté - Tentative bloquée
                                                </p>
                                            </div>
                                        )}

                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Original (non sécurisé):</p>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all block">
                                                {item.original}
                                            </code>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Sanitized (sécurisé):</p>
                                            <code className="text-xs bg-green-50 px-2 py-1 rounded font-mono break-all block text-green-700">
                                                {item.sanitized}
                                            </code>
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
