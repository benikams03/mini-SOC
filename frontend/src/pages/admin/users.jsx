import { useState } from 'react'
import { Users as UsersIcon, Plus, Eye, Shield, Clock } from 'lucide-react'

export default function Users() {
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [filter, setFilter] = useState('all')

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const users = [
        { 
            id: 1, 
            username: 'admin', 
            email: 'admin@minisoc.com',
            role: 'admin',
            status: 'active',
            created: '2024-08-15',
            lastLogin: '2024-08-28 11:25:00'
        },
        { 
            id: 2, 
            username: 'security_analyst', 
            email: 'analyst@minisoc.com',
            role: 'analyst',
            status: 'active',
            created: '2024-08-16',
            lastLogin: '2024-08-28 10:15:00'
        },
        { 
            id: 3, 
            username: 'operator_1', 
            email: 'operator1@minisoc.com',
            role: 'operator',
            status: 'active',
            created: '2024-08-17',
            lastLogin: '2024-08-28 09:30:00'
        },
        { 
            id: 4, 
            username: 'operator_2', 
            email: 'operator2@minisoc.com',
            role: 'operator',
            status: 'inactive',
            created: '2024-08-18',
            lastLogin: '2024-08-27 16:45:00'
        },
        { 
            id: 5, 
            username: 'auditor', 
            email: 'auditor@minisoc.com',
            role: 'auditor',
            status: 'active',
            created: '2024-08-19',
            lastLogin: '2024-08-28 08:00:00'
        },
        { 
            id: 6, 
            username: 'manager', 
            email: 'manager@minisoc.com',
            role: 'manager',
            status: 'active',
            created: '2024-08-20',
            lastLogin: '2024-08-28 11:00:00'
        },
    ]

    const filteredUsers = users.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'active' && item.status === 'active') ||
            (filter === 'inactive' && item.status === 'inactive') ||
            (filter === 'admin' && item.role === 'admin') ||
            (filter === 'analyst' && item.role === 'analyst')
        
        return matchesFilter
    })

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700',
            analyst: 'bg-blue-100 text-blue-700',
            operator: 'bg-green-100 text-green-700',
            auditor: 'bg-orange-100 text-orange-700',
            manager: 'bg-gray-100 text-gray-700'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        )
    }

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-700'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status === 'active' ? 'Actif' : 'Inactif'}
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
        setNewUser({ username: '', email: '', password: '' })
    }

    const handleSaveUser = (e) => {
        e.preventDefault()
        // Here you would typically save the user to your backend
        console.log('Saving user:', newUser)
        closeAddModal()
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

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'all' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('all')}
                        >
                            Tous les utilisateurs
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'active' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('active')}
                        >
                            Actifs
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'inactive' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('inactive')}
                        >
                            Inactifs
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'admin' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('admin')}
                        >
                            Admins
                        </button>
                        <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'analyst' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setFilter('analyst')}
                        >
                            Analystes
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total utilisateurs</p>
                            <p className="text-xl font-bold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Actifs</p>
                            <p className="text-xl font-bold text-gray-900">
                                {users.filter(u => u.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Nom d'utilisateur</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Rôle</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Créé le</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-900">{user.username}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-900">{user.email}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">{user.created}</span>
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
                                        {selectedUser.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedUser.username}</h4>
                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                </div>
                                <div className="ml-auto">
                                    {getRoleBadge(selectedUser.role)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <div>{getStatusBadge(selectedUser.status)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Créé le</label>
                                    <p className="text-gray-900">{selectedUser.created}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dernière connexion</label>
                                    <p className="text-gray-900">{selectedUser.lastLogin}</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="Entrez le nom d'utilisateur"
                                />
                            </div>
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
