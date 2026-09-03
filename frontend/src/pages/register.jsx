import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/button'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas')
            return
        }
        
        setIsLoading(true)
        
        // Simulate registration and redirect to email confirmation
        setTimeout(() => {
            setIsLoading(false)
            navigate('/email-confirmation', { state: { email } })
        }, 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Créer un compte</h1>
                    <p className="text-gray-500">Rejoignez Mini-SOC</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Adresse email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmer le mot de passe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Inscription...' : 'S\'inscrire'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-gray-900 hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>

                <Link to="/simulation">
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full mt-8"
                    >
                        Accedez a l'interface de simulation
                    </Button>
                </Link>
            </div>
        </div>
    )
}
