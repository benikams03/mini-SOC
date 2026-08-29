import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/button'

export default function MFA() {
    const [codes, setCodes] = useState(['', '', '', '', ''])
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const inputRefs = useRef([])

    useEffect(() => {
        if (timer > 0 && !canResend) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else if (timer === 0) {
            setCanResend(true)
        }
    }, [timer, canResend])

    const handleCodeChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1)
        }

        const newCodes = [...codes]
        newCodes[index] = value
        setCodes(newCodes)

        // Auto-focus next input
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !codes[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleResend = () => {
        setTimer(60)
        setCanResend(false)
        setCodes(['', '', '', '', ''])
        inputRefs.current[0]?.focus()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const code = codes.join('')
        
        if (code.length !== 5) {
            return
        }

        setIsLoading(true)
        
        // Simulate MFA verification and redirect to admin
        setTimeout(() => {
            setIsLoading(false)
            navigate('/admin')
        }, 1000)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Vérification en deux étapes</h1>
                    <p className="text-gray-500">
                        Entrez le code à 5 chiffres envoyé à votre adresse email
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                        {codes.map((code, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={code}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl font-semibold bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || codes.join('').length !== 5}
                        className="w-full"
                    >
                        {isLoading ? 'Vérification...' : 'Vérifier'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-gray-900 hover:underline text-sm"
                        >
                            Renvoyer le code
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            Renvoyer le code dans <span className="text-gray-900">{formatTime(timer)}</span>
                        </p>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                    >
                        ← Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    )
}
