import { useState, useEffect } from 'react'
import { Users as UsersIcon, Plus, Eye, Shield, Clock } from 'lucide-react'
import { get_users, register_simulation } from '../../services/index.js'

export default function Users() {
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const [newUser, setNewUser] = useState({
        email: '',
        password: ''
    })

    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await get_users()
            if (response.success) {
                setUsers(response.data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'active' && item.isVerify === true) ||
            (filter === 'inactive' && item.isVerify === false) ||
            (filter === 'admin' && item.role === 'admin') ||
            (filter === 'simulation' && item.role === 'simulation')
        
        return matchesFilter
    })

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700',
            simulation: 'bg-blue-100 text-blue-700'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        )
    }

    const getStatusBadge = (isVerify) => {
        const styles = {
            true: 'bg-green-100 text-green-700',
            false: 'bg-gray-100 text-gray-700'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[isVerify]}`}>
                {isVerify ? 'Actif' : 'Inactif'}
            </span>
        )
    }

    const handleViewDetails = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    const handleAddUser = () => {
        setIsAddModalOpen(true)
    }

    const closeAddModal = () => {
        setIsAddModalOpen(false)
        setNewUser({ email: '', password: '' })
    }

    const handleSaveUser = async (e) => {
        e.preventDefault()
        try {
            const response = await register_simulation(newUser)
            if (response.success) {
                // Recharger la liste des utilisateurs
                await loadUsers()
                closeAddModal()
            } else {
                alert('Erreur lors de la création de l\'utilisateur: ' + response.message)
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error)
            alert('Erreur lors de la création de l\'utilisateur')
        }
    }

    return (
        <div className="flex-1 p-2.5 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
                    <p className="text-sm text-gray-600 mt-1">Gérez les utilisateurs du système</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleAddUser}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un utilisateur
                    </button>
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                        <UsersIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{users.length} utilisateurs</span>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement des utilisateurs...</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Index</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Rôle</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Créé le</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">#{index + 1}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{user.email}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => handleViewDetails(user)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title="Voir les détails"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className='flex items-center justify-center flex-col text-center w-full h-80'>
                            <UsersIcon className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-gray-600">Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>
                )}
            </div>

            {/* User Details Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                    <div className="bg-white border border-gray-300 w-full max-w-2xl p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-5">Détails de l'utilisateur</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-600">
                                        {selectedUser.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedUser.email}</h4>
                                    <p className="text-sm text-gray-500">ID: {selectedUser._id}</p>
                                </div>
                                <div className="ml-auto">
                                    {getRoleBadge(selectedUser.role)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <div>{getStatusBadge(selectedUser.isVerify)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Créé le</label>
                                    <p className="text-gray-900">
                                        {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button 
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={closeModal}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
                    <div className="bg-white border border-gray-300 w-full max-w-md p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-5">Ajouter un utilisateur</h2>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="Entrez l'adresse email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="Entrez le mot de passe"
                                />
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                                <button 
                                    type="button"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={closeAddModal}
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
