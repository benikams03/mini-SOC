import { useState } from 'react'
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import Button from '../components/ui/button'
import { resend_mail_inscription_admin } from '../services'
import toast from 'react-hot-toast'


export default function EmailConfirmation() {

    const { email } = useParams()
    const [isResending, setIsResending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleResendEmail =async () => {
        setIsResending(true)
        try {
            await resend_mail_inscription_admin({
                email: email
            })
            toast.success('Email de confirmation envoyé avec succès')
        } catch (error) {
            console.error('Error resending email:', error)
            toast.error('Erreur lors de l\'envoi de l\'email de confirmation')
        } finally {
            setIsResending(false)
        }
    }

    const handleBackToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Mail className="text-gray-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Vérifiez votre email</h1>
                    <p className="text-gray-500">
                        Un email de confirmation a été envoyé à <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <p className="text-gray-700 text-sm text-center">
                        Veuillez cliquer sur le lien dans l'email pour confirmer votre inscription. 
                        Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
                    </p>
                </div>

                <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    disabled={isResending}
                    className="w-full mb-4"
                >
                    {isResending ? (
                        <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="animate-spin" size={16} />
                            Envoi en cours...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <RefreshCw size={16} />
                            Renvoyer l'email
                        </span>
                    )}
                </Button>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Email déjà confirmé ?{' '}
                        <button 
                            onClick={handleBackToLogin}
                            className="text-gray-900 hover:underline"
                        >
                            Se connecter
                        </button>
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
