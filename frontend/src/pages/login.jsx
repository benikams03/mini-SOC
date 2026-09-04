import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/button'
import { login_admin } from '../services'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

export default function Login() {

    const { register, handleSubmit, reset } = useForm()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (data) => {
       try{
            setIsLoading(true)
            const response = await login_admin(data)
            if(response.success){
                toast.success('Connexion réussie')
                navigate('/mfa/qwertyuijhgfdsdvbgfewertyuuysdfvcxsdfgfdertyuufewsdfvbvdssdfghjhgfddfbvcx/' + data.email)
            }else {
                toast.error(response.message)
            }
       }catch(error){
            toast.error(error.message)
       }finally{
            setIsLoading(false)
       }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Bienvenue</h1>
                    <p className="text-gray-500">Connectez-vous à Mini-SOC</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            placeholder="Adresse email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            {...register('password', { required: true })}
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Connexion...' : 'Continuer'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Vous n'avez pas de compte ?{' '}
                        <Link to="/register" className="text-gray-900 hover:underline">
                            S'inscrire
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
