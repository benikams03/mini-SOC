import { useState } from 'react'
import Button from '../../components/ui/button'

export default function SQLi() {
    const [username, setUsername] = useState('')
    const [queryResults, setQueryResults] = useState(null)
    const [queryLog, setQueryLog] = useState([])
    const [isVulnerable, setIsVulnerable] = useState(true)
    const [showHint, setShowHint] = useState(false)
    const [attackDetected, setAttackDetected] = useState(false)

    // Simulated database
    const database = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'alice', password: 'alice123', role: 'user' },
        { id: 3, username: 'bob', password: 'bob123', role: 'user' },
        { id: 4, username: 'charlie', password: 'charlie123', role: 'moderator' },
    ]

    const executeQuery = (input) => {
        let query = `SELECT * FROM users WHERE username = '${input}'`
        let results = []
        let isAttack = false

        if (isVulnerable) {
            // Simulate SQL injection
            if (input.includes("' OR '1'='1")) {
                query = `SELECT * FROM users WHERE username = '${input}' -- SQL Injection detected!`
                results = database
                isAttack = true
            } else if (input.includes("' OR 1=1--")) {
                query = `SELECT * FROM users WHERE username = '${input}' -- SQL Injection detected!`
                results = database
                isAttack = true
            } else if (input.includes("'; DROP TABLE")) {
                query = `SELECT * FROM users WHERE username = '${input}' -- SQL Injection: DROP TABLE attempted!`
                results = []
                isAttack = true
            } else if (input.includes("UNION SELECT")) {
                query = `SELECT * FROM users WHERE username = '${input}' -- SQL Injection: UNION SELECT detected!`
                results = database
                isAttack = true
            } else {
                // Normal query
                results = database.filter(user => user.username === input)
            }
        } else {
            // Sanitized query (using parameterized queries)
            query = `SELECT * FROM users WHERE username = ? [${input}]`
            results = database.filter(user => user.username === input)
        }

        const logEntry = {
            id: queryLog.length + 1,
            query,
            timestamp: new Date().toLocaleTimeString(),
            isAttack
        }
        
        setQueryLog([logEntry, ...queryLog])
        setQueryResults(results)
        
        if (isAttack) {
            setAttackDetected(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        executeQuery(username)
    }

    const resetSimulation = () => {
        setUsername('')
        setQueryResults(null)
        setQueryLog([])
        setAttackDetected(false)
    }

    const examplePayloads = [
        "' OR '1'='1",
        "' OR 1=1--",
        "admin' --",
        "' UNION SELECT * FROM users--",
        "'; DROP TABLE users--",
    ]

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Injection SQL</h1>
                    <p className="text-gray-600">
                        Découvrez et exploitez des vulnérabilités d'injection SQL dans une base de données.
                        Apprenez à protéger vos applications contre ce type d'attaque.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recherche utilisateur</h2>
                        
                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isVulnerable}
                                    onChange={(e) => setIsVulnerable(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">
                                    Mode vulnérable (concaténation de chaînes)
                                </span>
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom d'utilisateur
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Entrez un nom d'utilisateur..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="primary"
                                className="w-full"
                            >
                                Rechercher
                            </Button>
                        </form>

                        {/* Example Payloads */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Payloads SQLi courants</h3>
                            <div className="space-y-2">
                                {examplePayloads.map((payload, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setUsername(payload)}
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
                                    🚨 Attaque SQL injection détectée ! La requête a été modifiée.
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

                        {/* Query Log */}
                        {queryLog.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Dernière requête exécutée</h3>
                                <div className={`p-3 rounded-lg border font-mono text-xs ${
                                    queryLog[0].isAttack 
                                        ? 'bg-red-50 border-red-200 text-red-800' 
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}>
                                    {queryLog[0].query}
                                </div>
                            </div>
                        )}

                        {/* Results Table */}
                        {queryResults === null ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucune recherche effectuée</p>
                            </div>
                        ) : queryResults.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucun résultat trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-2 px-3 font-medium text-gray-500">ID</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-500">Username</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-500">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {queryResults.map((user) => (
                                            <tr key={user.id}>
                                                <td className="py-2 px-3 text-gray-900">{user.id}</td>
                                                <td className="py-2 px-3 text-gray-900">{user.username}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        user.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-700' 
                                                            : user.role === 'moderator'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {attackDetected && queryResults && queryResults.length > 1 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ L'injection a permis de récupérer toutes les données de la table !
                                </p>
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
                                Les injections SQL exploitent la concaténation de chaînes dans les requêtes SQL. 
                                En utilisant des caractères comme l'apostrophe (') et des opérateurs logiques (OR, AND), 
                                vous pouvez modifier la logique de la requête. Essayez d'utiliser ' OR '1'='1 
                                pour contourner la vérification du nom d'utilisateur et récupérer tous les enregistrements.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Objectif pédagogique</h3>
                    <p className="text-sm text-gray-600">
                        Cette simulation illustre les vulnérabilités d'injection SQL, l'une des plus critiques 
                        selon OWASP Top 10. Les attaques SQLi permettent de lire, modifier ou supprimer des données, 
                        voire d'exécuter des commandes système. Les contre-mesures essentielles incluent l'utilisation 
                        de requêtes paramétrées (prepared statements), l'ORM (Object-Relational Mapping), 
                        la validation des entrées, et le principe du moindre privilège pour les comptes de base de données.
                    </p>
                </div>
            </div>
        </div>
    )
}
