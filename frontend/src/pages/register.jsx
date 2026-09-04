import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/button'
import { Inscription_admin } from '../services'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

export default function Register() {

    const { register, handleSubmit, reset } = useForm()

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        try{
            setIsLoading(true)
            if(e['confirme-password'] !== e.password){
                toast.error('Les mots de passe ne correspondent pas')
                return
            }
            const res = await Inscription_admin(e)
            if(res.success){
                toast.success('Compte créé avec succès')
                reset()
                navigate('/email-confirmation/qwertyuijhgfdsdvbgfewertyuuysdfvcxsdfgfdertyuufewsdfvbvdssdfghjhgfddfbvcx/'+e.email)
            }else{
                toast.error(res.message)
            }
            
        }catch(e){
            toast.error(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Créer un compte</h1>
                    <p className="text-gray-500">Rejoignez Mini-SOC</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            {...register('email', {
                                required: true
                            })}
                            placeholder="Adresse email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            {...register('password', {
                                required: true
                            })}
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            {...register('confirme-password', {
                                required: true
                            })}
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
