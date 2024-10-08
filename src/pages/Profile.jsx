import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BackButton from '../components/BackButton';
import AvatarUploader from '../components/AvatarUploader';
import ProfileForm from '../components/ProfileForm';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    password: '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  // Sync profileData state with user from context when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        nickname: user.nickname,
        email: user.email,
        password: '', // Clear password for security reasons
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Handle saving profile updates
  const handleSaveProfile = async (updatedProfileData) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      setLoading(false);
      return;
    }

    const saveProfile = async () => {
      const response = await axios.put(
        'http://localhost:8080/api/users/',
        {
          nickname: updatedProfileData.nickname,
          email: updatedProfileData.email,
          password: updatedProfileData.password || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = response.data.data;
      updateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
    };

    try {
      toast.promise(saveProfile, {
        loading: 'Saving profile changes...',
        success: 'Profile updated successfully!',
        error: (err) => err.response?.data?.error || 'Saving failed. Please try again.',
      });
    } catch (error) {
      console.error('Error updating proflie:', error);
      toast.error('An error occurred updating profile.');
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <BackButton />
      <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px] mt-5 gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Uploader */}
          <AvatarUploader
            currentAvatar={profileData.avatar}
            profileData={profileData}
            setProfileData={setProfileData}
            updateUser={updateUser}
          />

          {/* Profile Form */}
          <ProfileForm
            profileData={profileData}
            setProfileData={setProfileData}
            onSaveProfile={handleSaveProfile}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
