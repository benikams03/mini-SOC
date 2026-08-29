import { useState } from 'react'
import Button from '../../components/ui/button'

export default function XSS() {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([
        { id: 1, user: 'Alice', text: 'Excellent site !', timestamp: '10:30' },
        { id: 2, user: 'Bob', text: 'J\'adore le design', timestamp: '11:15' },
    ])
    const [isVulnerable, setIsVulnerable] = useState(true)
    const [showHint, setShowHint] = useState(false)
    const [attackDetected, setAttackDetected] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Check for XSS payload
        const xssPatterns = ['<script', 'javascript:', 'onerror=', 'onload=', '<img', '<svg']
        const hasXSS = xssPatterns.some(pattern => comment.toLowerCase().includes(pattern))
        
        if (hasXSS && isVulnerable) {
            setAttackDetected(true)
        }

        const newComment = {
            id: comments.length + 1,
            user: 'Visiteur',
            text: isVulnerable ? comment : sanitizeInput(comment),
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isMalicious: hasXSS
        }
        
        setComments([newComment, ...comments])
        setComment('')
    }

    const sanitizeInput = (input) => {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
    }

    const resetSimulation = () => {
        setComment('')
        setComments([
            { id: 1, user: 'Alice', text: 'Excellent site !', timestamp: '10:30' },
            { id: 2, user: 'Bob', text: 'J\'adore le design', timestamp: '11:15' },
        ])
        setAttackDetected(false)
    }

    const examplePayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
    ]

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Injection XSS</h1>
                    <p className="text-gray-600">
                        Exploitez une vulnérabilité XSS pour injecter du code malveillant dans une application web.
                        Apprenez à détecter et prévenir ce type d'attaque.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formulaire de commentaire</h2>
                        
                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isVulnerable}
                                    onChange={(e) => setIsVulnerable(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">
                                    Mode vulnérable (pas de sanitization)
                                </span>
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Votre commentaire
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Écrivez votre commentaire..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="primary"
                                className="w-full"
                            >
                                Publier le commentaire
                            </Button>
                        </form>

                        {/* Example Payloads */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Payloads XSS courants</h3>
                            <div className="space-y-2">
                                {examplePayloads.map((payload, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setComment(payload)}
                                        className="w-full text-left text-xs font-mono bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        {payload}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {attackDetected && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 font-medium">
                                    🚨 Attaque XSS détectée ! Le code a été exécuté.
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

                        <div className="space-y-4 max-h-96 overflow-auto">
                            {comments.map((comment) => (
                                <div 
                                    key={comment.id}
                                    className={`p-4 rounded-lg border ${
                                        comment.isMalicious 
                                            ? 'bg-red-50 border-red-200' 
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{comment.user}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                    </div>
                                    <div 
                                        className="text-sm text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: comment.text }}
                                    />
                                    {comment.isMalicious && (
                                        <div className="mt-2 text-xs text-red-600 font-medium">
                                            ⚠️ Payload XSS détecté
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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
                                Les attaques XSS consistent à injecter du code malveillant (généralement JavaScript) 
                                dans des pages web qui sont affichées sans validation appropriée. 
                                Essayez d\'injecter un script alert() en utilisant des balises HTML comme 
                                &lt;script&gt; ou des événements comme onerror dans une balise img.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Objectif pédagogique</h3>
                    <p className="text-sm text-gray-600">
                        Cette simulation illustre les vulnérabilités XSS (Cross-Site Scripting). 
                        Il existe trois types principaux : Stored XSS (le code est stocké sur le serveur), 
                        Reflected XSS (le code est reflété dans la réponse), et DOM-based XSS 
                        (le code est exécuté côté client). Les contre-mesures incluent la sanitization 
                        des entrées, l'encodage des sorties, l'utilisation de Content Security Policy (CSP), 
                        et la validation stricte des données.
                    </p>
                </div>
            </div>
        </div>
    )
}
