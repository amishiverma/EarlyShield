import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDsquM8W_8wrc4mSLbXSGzX5Ol8iJZV3n7h3UIQoKQN0cvhsZtHPaO6EgSEKgK1AQL9Vi8Fmel7QH4GApvEQwRjNPbCW6vBxZArxuFfrqUt6UEQYOUHKwqwMJ7txroBdbflF0259u8ctVeFsXx_xN57yaKyWG9aTm0LWN-Js6LJtzh9WJTq18jWCryU6-L0vHzX1GVS2f15SaacTOaVoOVLUvOYWc200qDBqrTjce1HJkgCQ9cc9jdo6pEiEMcQnPoYLz0kqG1cBo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sorelle",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=George"
];

const ProfilePage = () => {
  const { userType, user, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  
  useEffect(() => {
    setEditName(user.name);
  }, [user.name]);

  const isAdmin = userType === 'Admin';

  const handleSave = () => {
    updateUser({ name: editName });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-background flex flex-col items-center pt-16 p-8">
         <div className="w-full max-w-2xl bg-white dark:bg-surface rounded-[32px] overflow-hidden shadow-sm border border-surface-variant">
             <div className={`h-32 relative ${isAdmin ? 'bg-primary/10' : 'bg-orange-100'}`}>
                 <div className="absolute -bottom-16 left-8 group">
                     <img 
                      src={user.avatar}
                      className={`w-32 h-32 rounded-full border-4 border-white dark:border-surface object-cover bg-white ${isAdmin ? 'ring-0' : 'ring-4 ring-orange-500/20'}`}
                      alt="Profile"
                     />
                     {isEditing && (
                         <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                             Change
                         </div>
                     )}
                 </div>
                 {/* Badge */}
                 <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-text-main shadow-sm border border-white/50">
                     {userType} View
                 </div>
             </div>
             <div className="pt-20 px-8 pb-8">
                 <div className="flex justify-between items-start mb-6">
                     <div className="flex-1 mr-4">
                         {isEditing ? (
                             <input 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)}
                                className="text-3xl font-display font-bold text-text-main bg-surface-variant/30 rounded-lg px-2 py-1 w-full border-none focus:ring-2 focus:ring-primary"
                             />
                         ) : (
                            <h1 className="text-3xl font-display font-bold text-text-main">{user.name}</h1>
                         )}
                         <p className="text-lg text-text-secondary">{user.role}</p>
                     </div>
                     <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                        className={`px-6 py-2 rounded-full font-bold shadow-md transition-all ${isEditing ? 'bg-primary text-white' : 'bg-surface-variant text-text-main'}`}
                     >
                         {isEditing ? 'Save Profile' : 'Edit Profile'}
                     </button>
                 </div>

                 {isEditing && (
                     <div className="mb-8 p-4 bg-surface rounded-2xl border border-surface-variant">
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-3">Choose Avatar</p>
                         <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                             {AVATARS.map((avatar, idx) => (
                                 <button 
                                    key={idx}
                                    onClick={() => updateUser({ avatar: avatar })}
                                    className={`w-14 h-14 rounded-full border-2 p-0.5 shrink-0 transition-all ${user.avatar === avatar ? 'border-primary scale-110' : 'border-transparent hover:border-surface-variant'}`}
                                 >
                                     <img src={avatar} className="w-full h-full rounded-full object-cover bg-white" alt={`Avatar ${idx}`} />
                                 </button>
                             ))}
                         </div>
                     </div>
                 )}
                 
                 <div className="grid grid-cols-2 gap-8 mt-8 border-t border-surface-variant pt-8">
                     <div>
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">{isAdmin ? 'Department' : 'Major'}</p>
                         <p className="text-lg font-medium text-text-main">{user.department}</p>
                     </div>
                     <div>
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">{isAdmin ? 'Employee ID' : 'Student ID'}</p>
                         <p className="text-lg font-medium text-text-main">{user.idString}</p>
                     </div>
                     <div>
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">Email</p>
                         <p className="text-lg font-medium text-text-main">{user.email}</p>
                     </div>
                      <div>
                         <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">Role Access</p>
                         <p className="text-lg font-medium text-text-main">{isAdmin ? 'Admin Level 2' : 'Student (Standard)'}</p>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;