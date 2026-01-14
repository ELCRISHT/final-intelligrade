import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { 
  Shield, 
  Users, 
  Activity, 
  TrendingUp, 
  Search, 
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  Unlock,
  KeyRound,
  Save,
  X
} from 'lucide-react';

interface AdminProps {
  user: User | null;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  college?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
}

const ROLE_PERMISSIONS = {
  admin: [
    'view_all_modules',
    'manage_users',
    'create_users',
    'edit_users',
    'delete_users',
    'reset_passwords',
    'assign_roles',
    'manage_permissions',
    'system_settings',
    'view_all_data',
    'export_data',
    'manage_access'
  ],
  faculty: [
    'view_dashboard',
    'view_students',
    'view_own_college_data',
    'edit_grades',
    'view_reports',
    'export_college_data'
  ],
  student: [
    'view_own_data',
    'view_performance'
  ]
};

const Admin: React.FC<AdminProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'faculty' | 'student'>('all');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null);
  const [resetTarget, setResetTarget] = useState<SystemUser | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'faculty' as 'admin' | 'faculty' | 'student',
    college: ''
  });
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Mock system users data (in production, this would come from API)
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@intelligrade.edu.ph',
      role: 'admin',
      createdAt: '2025-01-01',
      status: 'active',
      permissions: ROLE_PERMISSIONS.admin
    },
    {
      id: '2',
      name: 'Dr. Juan Dela Cruz',
      email: 'juan.delacruz@intelligrade.edu.ph',
      role: 'faculty',
      college: 'College of Computer Studies',
      createdAt: '2025-01-05',
      status: 'active',
      permissions: ROLE_PERMISSIONS.faculty
    },
    {
      id: '3',
      name: 'Dr. Maria Santos',
      email: 'maria.santos@intelligrade.edu.ph',
      role: 'faculty',
      college: 'College of Engineering',
      createdAt: '2025-01-10',
      status: 'active',
      permissions: ROLE_PERMISSIONS.faculty
    },
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = systemUsers.length;
    const admins = systemUsers.filter(u => u.role === 'admin').length;
    const faculty = systemUsers.filter(u => u.role === 'faculty').length;
    const activeUsers = systemUsers.filter(u => u.status === 'active').length;
    
    return { totalUsers, admins, faculty, activeUsers };
  }, [systemUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return systemUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [systemUsers, searchTerm, filterRole]);

  const handleDeleteUser = async () => {
    if (deleteTarget) {
      setSystemUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setSelectedUser(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: SystemUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        college: formData.college || undefined,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        permissions: ROLE_PERMISSIONS[formData.role]
      };
      
      setSystemUsers(prev => [...prev, newUser]);
      setShowUserForm(false);
      setFormData({ name: '', email: '', role: 'faculty', college: '' });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetTarget) {
      setIsLoadingForm(true);
      try {
        // Simulate sending password reset email
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowResetPassword(false);
        setResetTarget(null);
        alert(`Password reset email sent to ${resetTarget.email}`);
      } finally {
        setIsLoadingForm(false);
      }
    }
  };

  const handleToggleAccess = async (targetUser: SystemUser) => {
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    setSystemUsers(prev => 
      prev.map(u => u.id === targetUser.id ? { ...u, status: newStatus } : u)
    );
    
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'faculty':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'student':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (status === 'inactive') return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    return <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
          <Shield className="text-red-600 dark:text-red-400 w-8 h-8" />
          Admin Panel
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Manage system users, roles, and monitor platform activity.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.totalUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Administrators</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.admins}</p>
            </div>
            <Shield className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Faculty Members</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.faculty}</p>
            </div>
            <Activity className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.activeUsers}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Users Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-6">
        {/* Header with Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">System Users</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage administrators and faculty members</p>
          </div>
          <button 
            onClick={() => setShowUserForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            aria-label="Filter by role"
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="faculty">Faculty</option>
            <option value="student">Students</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Role</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Joined</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((sysUser) => (
                  <tr key={sysUser.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{sysUser.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sysUser.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(sysUser.role)}`}>
                        {sysUser.role.charAt(0).toUpperCase() + sysUser.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sysUser.status)}
                        <span className="capitalize text-slate-600 dark:text-slate-400">{sysUser.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sysUser.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(sysUser)}
                          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setResetTarget(sysUser);
                            setShowResetPassword(true);
                          }}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleAccess(sysUser)}
                          className={`p-2 rounded transition-colors ${
                            sysUser.status === 'active' 
                              ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={sysUser.status === 'active' ? 'Revoke Access' : 'Grant Access'}
                        >
                          {sysUser.status === 'active' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteTarget(sysUser);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New User</h3>
              <button onClick={() => setShowUserForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Dr. Juan Dela Cruz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="juan@intelligrade.edu.ph"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}                aria-label="User Role"                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">Administrator</option>
                  <option value="student">Student</option>
                </select>
              </div>
              
              {formData.role === 'faculty' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College</label>
                  <input 
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="College of Computer Studies"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoadingForm}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoadingForm ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && resetTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <KeyRound className="w-6 h-6" />
              <h3 className="text-lg font-bold">Reset Password</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Send a password reset email to <strong>{resetTarget.name}</strong> ({resetTarget.email})?
            </p>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => {
                  setShowResetPassword(false);
                  setResetTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleResetPassword}
                disabled={isLoadingForm}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {isLoadingForm ? 'Sending...' : 'Send Reset Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Delete User?</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && !showDeleteConfirm && !showResetPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Email</p>
                <p className="text-sm text-slate-900 dark:text-white mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Role</p>
                <p className="text-sm mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role === 'admin' ? 'System Admin' : selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            {selectedUser.college && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">College</p>
                <p className="text-sm text-slate-900 dark:text-white mt-1">{selectedUser.college}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Status</p>
                <div className="flex items-center gap-2 text-sm mt-1">
                  {getStatusIcon(selectedUser.status)}
                  <span className="capitalize text-slate-900 dark:text-white">{selectedUser.status}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Joined</p>
                <p className="text-sm text-slate-900 dark:text-white mt-1">{selectedUser.createdAt}</p>
              </div>
            </div>
            
            {/* Permissions */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permissions ({selectedUser.permissions.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedUser.permissions.map(perm => (
                  <div key={perm} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {perm.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => {
                  setResetTarget(selectedUser);
                  setShowResetPassword(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-medium text-sm"
              >
                <KeyRound className="w-4 h-4" />
                Reset Password
              </button>
              <button 
                onClick={() => {
                  handleToggleAccess(selectedUser);
                  setSelectedUser(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  selectedUser.status === 'active'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                }`}
              >
                {selectedUser.status === 'active' ? (
                  <><Unlock className="w-4 h-4" /> Revoke Access</>
                ) : (
                  <><Lock className="w-4 h-4" /> Grant Access</>
                )}
              </button>
              <button 
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
