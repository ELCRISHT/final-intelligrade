import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Shield, Bell, Save, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../src/config/firebase';

interface SettingsProps {
  user: User | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['bg-slate-200 dark:bg-slate-700', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][passwordStrength];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No user is currently signed in.');
      }

      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePassword(false);

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/wrong-password': 'Current password is incorrect.',
        'auth/invalid-credential': 'Current password is incorrect.',
        'auth/weak-password': 'New password is too weak. Use at least 6 characters.',
        'auth/requires-recent-login': 'Please log out and log back in, then try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      setError(errorMessages[error.code] || error.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    setError('');
    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No user is currently signed in.');
      }

      await sendPasswordResetEmail(auth, currentUser.email);
      setResetEmailSent(true);
      setShowChangePassword(false);

      // Reset after 10 seconds
      setTimeout(() => setResetEmailSent(false), 10000);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
       <div>
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
         <p className="text-slate-500 dark:text-slate-400">Manage your profile and system preferences.</p>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 space-y-8 transition-colors">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <UserIcon className="text-blue-600 dark:text-blue-400 w-5 h-5" /> Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-70" disabled />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" defaultValue={user?.email} className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-70" disabled />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                  <input type="tel" defaultValue={user?.contactNumber || 'Not provided'} className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-70" disabled />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College</label>
                  <input type="text" defaultValue={user?.college || 'General'} className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-70" disabled />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <input type="text" defaultValue={user?.role} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg capitalize bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-70" disabled />
               </div>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Security */}
          <section className="space-y-4">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield className="text-blue-600 dark:text-blue-400 w-5 h-5" /> Security
            </h2>

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Reset Email Sent Message */}
            {resetEmailSent && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                Password reset email sent! Check your inbox at <strong className="ml-1">{user?.email}</strong>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {!showChangePassword ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => { setShowChangePassword(true); setError(''); }}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Change Password
                </button>
                <button 
                  onClick={handleSendResetEmail}
                  disabled={isLoading}
                  className="text-slate-500 dark:text-slate-400 font-medium hover:underline text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Send Password Reset Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Change Your Password</h3>
                
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                      placeholder="Enter new password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Strength: <span className={`font-medium ${passwordStrength >= 3 ? 'text-green-600 dark:text-green-400' : passwordStrength >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{strengthLabel}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${confirmNewPassword && newPassword !== confirmNewPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg outline-none transition-all text-sm`}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={isLoading || (confirmNewPassword !== '' && newPassword !== confirmNewPassword)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setError('');
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {/* Forgot Password Link */}
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                  Forgot your current password? <button type="button" onClick={handleSendResetEmail} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Send reset email</button>
                </p>
              </form>
            )}
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

           {/* Notifications */}
          <section className="space-y-4">
             <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell className="text-blue-600 dark:text-blue-400 w-5 h-5" /> Notifications
            </h2>
            <div className="space-y-2">
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">Email me when a student is flagged as At-Risk</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">Weekly report summaries</span>
               </label>
            </div>
          </section>
          
          <div className="pt-4">
             <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
               <Save className="w-4 h-4" /> Save Changes
             </button>
          </div>
       </div>
    </div>
  );
};

export default Settings;