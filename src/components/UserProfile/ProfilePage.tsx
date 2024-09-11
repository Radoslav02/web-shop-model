import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css"

interface UserProfile {
  email: string;
  isAdmin: boolean;
  name: string;
  number: string;
  phoneNumber: string;
  place: string;
  postalCode: string;
  street: string;
  surname: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
      
        const uid = auth.currentUser.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile({
            email: data.email,
            isAdmin: data.isAdmin,
            name: data.name,
            number: data.number,
            phoneNumber: data.phoneNumber,
            place: data.place,
            postalCode: data.postalCode,
            street: data.street,
            surname: data.surname,
          });
          setFormData({
            email: data.email,
            isAdmin: data.isAdmin,
            name: data.name,
            number: data.number,
            phoneNumber: data.phoneNumber,
            place: data.place,
            postalCode: data.postalCode,
            street: data.street,
            surname: data.surname,
          });
          setUserId(uid);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/prijava');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (userId && formData) {
      try {
        const docRef = doc(db, "users", userId);
        const { email, ...updateData } = formData;
        await updateDoc(docRef, updateData);
        setUserProfile({ ...formData, email }); 
        setEditing(false);
      } catch (error) {
        console.error('Profile update failed', error);
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>Profil</h1>
      {userProfile ? (
        <div>
          <p>Email: {userProfile.email}</p>
          {editing ? (
            <div>
              <label>Ime:</label>
              <input
                type="text"
                value={formData?.name || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
               <label>Prezime:</label>
              <input
                type="text"
                value={formData?.surname || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, surname: e.target.value } : null)}
              />
             
              <label>Broj Telefona:</label>
              <input
                type="text"
                value={formData?.phoneNumber || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
              />
              <label>Mesto stanovanja:</label>
              <input
                type="text"
                value={formData?.place || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, place: e.target.value } : null)}
              />
              <label>Poštanski broj:</label>
              <input
                type="text"
                value={formData?.postalCode || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, postalCode: e.target.value } : null)}
              />
              <label>Naziv ulice:</label>
              <input
                type="text"
                value={formData?.street || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, street: e.target.value } : null)}
              />
               <label>Broj kuće:</label>
              <input
                type="text"
                value={formData?.number || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, number: e.target.value } : null)}
              />
             
              <button onClick={handleUpdateProfile}>Save Changes</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Ime: {userProfile.name}</p>
              <p>Prezime: {userProfile.surname}</p>
              <p>Broj telefona: {userProfile.phoneNumber}</p>
              <p>Mesto stanovanja: {userProfile.place}</p>
              <p>Poštanski broj: {userProfile.postalCode}</p>
              <p>Nayiv ulice: {userProfile.street}</p>
              <p>Broj kuće/zgrade: {userProfile.number}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
              <button onClick={handleLogout}>Log Out</button>
            </div>
            
          )}
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
