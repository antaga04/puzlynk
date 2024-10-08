import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const ProfileForm = ({ profileData, setProfileData, onSaveProfile, loading }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        nickname: user.nickname,
        email: user.email,
      });
    }
  }, [user, setProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    const updatedData = { ...profileData };
    onSaveProfile(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      nickname: user.nickname,
      email: user.email,
      password: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700">Nickname</label>
        <input
          type="text"
          name="nickname"
          value={profileData.nickname || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`mt-1 p-2 border w-full rounded-md focus:outline-none ${
            isEditing ? 'border-blue-500' : 'border-gray-300'
          }`}
        />
      </div>
      <div className="w-full max-w-md mt-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={profileData.email || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`mt-1 p-2 border w-full rounded-md focus:outline-none ${
            isEditing ? 'border-blue-500' : 'border-gray-300'
          }`}
        />
      </div>
      {isEditing ? (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileForm;

ProfileForm.propTypes = {
  profileData: PropTypes.object.isRequired,
  setProfileData: PropTypes.func.isRequired,
  onSaveProfile: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
