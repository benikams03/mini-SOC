import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/button'
import { loginSimulation } from '../../services/auth.js'

export default function LoginAttack() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [attempts, setAttempts] = useState([])
    const [isAttacking, setIsAttacking] = useState(false)
    const [attackCount, setAttackCount] = useState(0)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'monkey', 'master', 'dragon', '111111', 'baseball',
        'iloveyou', 'trustno1', 'sunshine', 'princess', 'admin',
        'letmein', 'welcome', 'football', 'shadow', 'master'
    ]

    const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
    }

    const handleSingleAttempt = async (data) => {
        setIsLoading(true)
        try {
            const response = await loginSimulation({
                email: data.username,
                password: data.password
            })
            
            const result = {
                id: attempts.length + 1,
                username: data.username,
                password: data.password ? '***' : '',
                status: response.success ? 'success' : 'failed',
                message: response.message,
                timestamp: new Date().toLocaleTimeString()
            }
            setAttempts([result, ...attempts])
            
            if (response.success) {
                setShowSuccess(true)
            }
        } catch (error) {
            const result = {
                id: attempts.length + 1,
                username: data.username,
                password: data.password ? '***' : '',
                status: 'error',
                message: 'Erreur de connexion',
                timestamp: new Date().toLocaleTimeString()
            }
            setAttempts([result, ...attempts])
        } finally {
            setIsLoading(false)
        }
    }

    const handleBruteForce = async () => {
        setIsAttacking(true)
        setIsRateLimited(false)
        let count = 0
        let consecutiveFailures = 0
        let shouldContinue = true
        
        const attackLoop = async () => {
            while (shouldContinue && count < commonPasswords.length + 10) {
                const randomPassword = count < commonPasswords.length 
                    ? commonPasswords[count] 
                    : generateRandomPassword()
                
                try {
                    const response = await loginSimulation({
                        email: 'admin@test.com',
                        password: randomPassword
                    })
                    
                    const result = {
                        id: attempts.length + count + 1,
                        username: 'admin@test.com',
                        password: randomPassword.substring(0, 3) + '***',
                        status: response.success ? 'success' : 'failed',
                        message: response.message,
                        timestamp: new Date().toLocaleTimeString()
                    }
                    
                    setAttempts(prev => [result, ...prev])
                    setAttackCount(count + 1)
                    
                    if (response.success) {
                        shouldContinue = false
                        setIsAttacking(false)
                        setShowSuccess(true)
                        return
                    }
                    
                    if (response.message && response.message.includes('Trop de requêtes')) {
                        shouldContinue = false
                        setIsRateLimited(true)
                        setIsAttacking(false)
                        return
                    }
                    
                    consecutiveFailures = 0
                    count++
                    
                    // Attendre un peu entre les requêtes
                    await new Promise(resolve => setTimeout(resolve, 300))
                    
                } catch (error) {
                    consecutiveFailures++
                    
                    const result = {
                        id: attempts.length + count + 1,
                        username: 'admin@test.com',
                        password: randomPassword.substring(0, 3) + '***',
                        status: 'error',
                        message: error.response?.data?.message || 'Erreur réseau',
                        timestamp: new Date().toLocaleTimeString()
                    }
                    
                    setAttempts(prev => [result, ...prev])
                    setAttackCount(count + 1)
                    
                    if (error.response?.data?.message && error.response.data.message.includes('Trop de requêtes')) {
                        shouldContinue = false
                        setIsRateLimited(true)
                        setIsAttacking(false)
                        return
                    }
                    
                    count++
                    
                    if (consecutiveFailures >= 3) {
                        shouldContinue = false
                        setIsAttacking(false)
                        return
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 500))
                }
            }
            
            setIsAttacking(false)
        }
        
        await attackLoop()
    }

    const resetSimulation = () => {
        setAttempts([])
        setAttackCount(0)
        setShowSuccess(false)
        setIsRateLimited(false)
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
                        
                        <form onSubmit={handleSubmit(handleSingleAttempt)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    {...register('username', { required: 'Ce champ est requis' })}
                                    placeholder="admin"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    {...register('password', { required: 'Ce champ est requis' })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
                                    {isLoading ? 'Chargement...' : 'Essayer'}
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
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">Aucune tentative enregistrée</p>
                                    <p className="text-gray-400 text-sm mt-1">Lancez une attaque pour voir les résultats</p>
                                </div>
                            ) : (
                                attempts.map((attempt) => (
                                    <div 
                                        key={attempt.id}
                                        className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                                            attempt.status === 'success' 
                                                ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50 hover:border-green-300/70' 
                                                : attempt.status === 'error'
                                                ? 'bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-200/50 hover:border-red-300/70'
                                                : 'bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200/50 hover:border-orange-300/70'
                                        }`}
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${
                                            attempt.status === 'success' 
                                                ? 'bg-gradient-to-b from-green-400 to-emerald-500' 
                                                : attempt.status === 'error'
                                                ? 'bg-gradient-to-b from-red-400 to-rose-500'
                                                : 'bg-gradient-to-b from-orange-400 to-amber-500'
                                        }`}></div>
                                        
                                        <div className="flex items-center justify-between p-4 pl-5">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                        attempt.status === 'success' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : attempt.status === 'error'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        #{attempt.id}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {attempt.username}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-gray-500">Mot de passe:</span>
                                                    <code className={`font-mono text-xs px-2 py-0.5 rounded ${
                                                        attempt.status === 'success' 
                                                            ? 'bg-green-100/50 text-green-800' 
                                                            : attempt.status === 'error'
                                                            ? 'bg-red-100/50 text-red-800'
                                                            : 'bg-orange-100/50 text-orange-800'
                                                    }`}>
                                                        {attempt.password}
                                                    </code>
                                                </div>
                                                {attempt.message && (
                                                    <div className="text-xs text-gray-500 mt-1.5 truncate">
                                                        {attempt.message}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-2 ml-4">
                                                <span className="text-xs text-gray-400 font-medium">{attempt.timestamp}</span>
                                                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                                    attempt.status === 'success' 
                                                        ? 'bg-green-500 text-white shadow-sm shadow-green-200' 
                                                        : attempt.status === 'error'
                                                        ? 'bg-red-500 text-white shadow-sm shadow-red-200'
                                                        : 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                                                }`}>
                                                    {attempt.status === 'success' ? (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    <span>{attempt.status === 'success' ? 'Succès' : attempt.status === 'error' ? 'Erreur' : 'Échec'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {isAttacking && (
                            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <p className="text-yellow-800 text-sm font-medium">
                                        Attaque en cours... {attackCount} tentatives effectuées
                                    </p>
                                </div>
                            </div>
                        )}

                        {isRateLimited && (
                            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-red-800 text-sm font-medium">
                                        ⚠ Attaque bloquée par le rate limiting ! Le système a détecté l'attaque par force brute.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
