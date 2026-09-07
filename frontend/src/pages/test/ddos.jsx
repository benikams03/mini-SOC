import { useState, useEffect, useRef } from 'react'
import Button from '../../components/ui/button'
import { api } from '../../services/config.js'

export default function DDoS() {
    const [targetUrl, setTargetUrl] = useState('http://localhost:5050/api/v1/login-simulation')
    const [requestMethod, setRequestMethod] = useState('POST')
    const [maxRequests, setMaxRequests] = useState(50)
    const [requestCount, setRequestCount] = useState(0)
    const [isAttacking, setIsAttacking] = useState(false)
    const [attackSpeed, setAttackSpeed] = useState(100)
    const [logs, setLogs] = useState([])
    const [totalRequests, setTotalRequests] = useState(0)
    const [successfulRequests, setSuccessfulRequests] = useState(0)
    const [failedRequests, setFailedRequests] = useState(0)
    const [startTime, setStartTime] = useState(null)
    const [isBlocked, setIsBlocked] = useState(false)
    const intervalRef = useRef(null)
    const shouldContinueRef = useRef(false)

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [{ id: prev.length + 1, message, type, timestamp }, ...prev])
    }

    const makeRequest = async () => {
        try {
            let response
            const cleanUrl = targetUrl.replace('http://localhost:5050/api/v1', '')
            
            if (requestMethod === 'POST') {
                response = await api.post(cleanUrl, {
                    email: 'test@example.com',
                    password: 'randompassword'
                })
            } else {
                response = await api.get(cleanUrl)
            }
            
            setSuccessfulRequests(prev => prev + 1)
            addLog(`✅ Requête #${requestCount + 1} réussie (${response.status})`, 'success')
            return true
        } catch (error) {
            setFailedRequests(prev => prev + 1)
            const errorMessage = error.response?.data?.message || error.message
            
            if (errorMessage.includes('Trop de requêtes')) {
                setIsBlocked(true)
                addLog(`🚨 BLOQUÉ: ${errorMessage}`, 'error')
                return false
            }
            
            addLog(`❌ Requête #${requestCount + 1} échouée: ${errorMessage}`, 'error')
            return false
        }
    }

    const startAttack = async () => {
        if (isAttacking) return
        
        setIsAttacking(true)
        setIsBlocked(false)
        setStartTime(new Date())
        setRequestCount(0)
        setTotalRequests(0)
        setSuccessfulRequests(0)
        setFailedRequests(0)
        setLogs([])
        shouldContinueRef.current = true
        
        addLog('⚠️ Démarrage de l\'attaque DDoS...', 'warning')
        addLog(`Cible: ${targetUrl}`, 'info')
        addLog(`Vitesse: ${attackSpeed}ms entre chaque requête`, 'info')
        addLog(`Limite: ${maxRequests} requêtes`, 'info')

        let localCount = 0
        
        while (shouldContinueRef.current && !isBlocked && localCount < maxRequests) {
            const success = await makeRequest()
            
            if (!success && isBlocked) {
                break
            }
            
            localCount++
            setRequestCount(localCount)
            setTotalRequests(localCount)
            
            // Attendre avant la prochaine requête
            await new Promise(resolve => setTimeout(resolve, attackSpeed))
        }
        
        if (localCount >= maxRequests) {
            addLog(`⏹️ Limite de ${maxRequests} requêtes atteinte pour la simulation`, 'info')
        }
        
        setIsAttacking(false)
        shouldContinueRef.current = false
    }

    const stopAttack = () => {
        shouldContinueRef.current = false
        setIsAttacking(false)
        addLog('⏹️ Attaque arrêtée', 'info')
    }

    const resetSimulation = () => {
        shouldContinueRef.current = false
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        setIsAttacking(false)
        setRequestCount(0)
        setTotalRequests(0)
        setSuccessfulRequests(0)
        setFailedRequests(0)
        setLogs([])
        setStartTime(null)
        setIsBlocked(false)
        // Keep maxRequests as set by user
    }

    const getRequestsPerSecond = () => {
        if (!startTime) return 0
        const elapsed = (new Date() - startTime) / 1000
        return elapsed > 0 ? (totalRequests / elapsed).toFixed(2) : 0
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Attaque par Requêtes Simultanées (DDoS)</h1>
                    <p className="text-gray-600">
                        Simulez une attaque par déni de service en envoyant de multiples requêtes simultanées. 
                        Observez comment les IDS détectent et bloquent ce type d'attaque.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Control Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Panneau de contrôle</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL cible</label>
                                <input
                                    type="text"
                                    value={targetUrl}
                                    onChange={(e) => setTargetUrl(e.target.value)}
                                    placeholder="https://example.com/api"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode HTTP</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setRequestMethod('POST')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                            requestMethod === 'POST'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        POST
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRequestMethod('GET')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                            requestMethod === 'GET'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        GET
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre maximum de requêtes
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={maxRequests}
                                    onChange={(e) => setMaxRequests(parseInt(e.target.value) || 50)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vitesse d'attaque (ms entre requêtes)
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={attackSpeed}
                                    onChange={(e) => setAttackSpeed(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Rapide (10ms)</span>
                                    <span>{attackSpeed}ms</span>
                                    <span>Lent (500ms)</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    variant="danger" 
                                    onClick={startAttack}
                                    disabled={isAttacking || isBlocked}
                                    className="flex-1"
                                >
                                    {isAttacking ? 'Attaque en cours...' : 'Démarrer l\'attaque'}
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={stopAttack}
                                    disabled={!isAttacking}
                                    className="flex-1"
                                >
                                    Arrêter
                                </Button>
                            </div>

                            <Button 
                                variant="secondary" 
                                onClick={resetSimulation}
                                className="w-full"
                            >
                                Réinitialiser la simulation
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Statistiques en temps réel</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Requêtes totales</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Requêtes/sec</p>
                                    <p className="text-2xl font-bold text-gray-900">{getRequestsPerSecond()}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-xs text-green-600">Réussies</p>
                                    <p className="text-2xl font-bold text-green-700">{successfulRequests}</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3">
                                    <p className="text-xs text-red-600">Échouées</p>
                                    <p className="text-2xl font-bold text-red-700">{failedRequests}</p>
                                </div>
                            </div>
                        </div>

                        {isBlocked && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 font-medium">
                                    🚨 BLOQUÉ - L'IDS a détecté l'attaque et bloqué votre adresse IP
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Logs Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal d'activité</h2>
                        
                        <div className="space-y-2 max-h-96 overflow-auto">
                            {logs.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Aucune activité enregistrée
                                </p>
                            ) : (
                                logs.map((log) => (
                                    <div 
                                        key={log.id}
                                        className={`p-3 rounded-lg border ${
                                            log.type === 'error' 
                                                ? 'bg-red-50 border-red-200' 
                                                : log.type === 'warning'
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : log.type === 'success'
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 flex-shrink-0">{log.timestamp}</span>
                                            <span className={`text-sm ${
                                                log.type === 'error' 
                                                    ? 'text-red-700' 
                                                    : log.type === 'warning'
                                                    ? 'text-yellow-700'
                                                    : log.type === 'success'
                                                    ? 'text-green-700'
                                                    : 'text-gray-700'
                                            }`}>
                                                {log.message}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Visual indicator */}
                        {isAttacking && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">Attaque en cours</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-100"
                                        style={{ width: `${Math.min((totalRequests / maxRequests) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Progression: {totalRequests}/{maxRequests} requêtes
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
