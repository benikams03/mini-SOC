import { useState } from 'react'
import Button from '../../components/ui/button'

export default function LoginAttack() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [attempts, setAttempts] = useState([])
    const [isAttacking, setIsAttacking] = useState(false)
    const [attackCount, setAttackCount] = useState(0)
    const [showSuccess, setShowSuccess] = useState(false)

    const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'monkey', 'master', 'dragon', '111111', 'baseball',
        'iloveyou', 'trustno1', 'sunshine', 'princess', 'admin'
    ]

    const handleSingleAttempt = (e) => {
        e.preventDefault()
        const result = {
            id: attempts.length + 1,
            username,
            password: password ? '***' : '',
            status: Math.random() > 0.95 ? 'success' : 'failed',
            timestamp: new Date().toLocaleTimeString()
        }
        setAttempts([result, ...attempts])
        
        if (result.status === 'success') {
            setShowSuccess(true)
        }
    }

    const handleBruteForce = () => {
        setIsAttacking(true)
        let count = 0
        
        const interval = setInterval(() => {
            if (count >= commonPasswords.length) {
                clearInterval(interval)
                setIsAttacking(false)
                return
            }
            
            const result = {
                id: attempts.length + count + 1,
                username: username || 'admin',
                password: commonPasswords[count],
                status: Math.random() > 0.95 ? 'success' : 'failed',
                timestamp: new Date().toLocaleTimeString()
            }
            
            setAttempts(prev => [result, ...prev])
            setAttackCount(count + 1)
            count++
            
            if (result.status === 'success') {
                clearInterval(interval)
                setIsAttacking(false)
                setShowSuccess(true)
            }
        }, 500)
    }

    const resetSimulation = () => {
        setAttempts([])
        setAttackCount(0)
        setShowSuccess(false)
        setUsername('')
        setPassword('')
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Attaque par Force Brute</h1>
                    <p className="text-gray-600">
                        Simulez une attaque par force brute sur un formulaire de connexion. 
                        Observez comment les IDS détectent ce type d'attaque.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Login Form */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Formulaire de connexion</h2>
                        
                        <form onSubmit={handleSingleAttempt} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" className="flex-1">
                                    Essayer
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="danger" 
                                    onClick={handleBruteForce}
                                    disabled={isAttacking}
                                    className="flex-1"
                                >
                                    {isAttacking ? 'Attaque en cours...' : 'Force Brute'}
                                </Button>
                            </div>
                        </form>

                        {showSuccess && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 font-medium">
                                    ✓ Connexion réussie ! Le mot de passe a été trouvé.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Attack Log */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Journal d'attaque</h2>
                            <Button variant="secondary" size="sm" onClick={resetSimulation}>
                                Réinitialiser
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-auto">
                            {attempts.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Aucune tentative enregistrée
                                </p>
                            ) : (
                                attempts.map((attempt) => (
                                    <div 
                                        key={attempt.id}
                                        className={`p-3 rounded-lg border ${
                                            attempt.status === 'success' 
                                                ? 'bg-green-50 border-green-200' 
                                                : 'bg-red-50 border-red-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{attempt.id} - {attempt.username}
                                            </span>
                                            <span className="text-xs text-gray-500">{attempt.timestamp}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            Mot de passe: {attempt.password}
                                        </div>
                                        <div className={`text-xs font-medium mt-1 ${
                                            attempt.status === 'success' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {attempt.status === 'success' ? '✓ Succès' : '✗ Échec'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {isAttacking && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠ Attaque en cours... {attackCount} tentatives effectuées
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
