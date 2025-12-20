import React, { useEffect, useState, cache } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }
  
        const fetchProfile = async () => {
            try {
              const data = await secureGet("/auth/me");
    
                // Adjust based on your API response shape
                setUser(data.user ?? data);
    
            } catch (err) {
                // Token invalid / expired / unauthorized
                localStorage.removeItem("token");
                localStorage.removeItem("user");
    
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };
  
        fetchProfile();
      }, [token, navigate]);
  
      if (loading) return <div>Loading profile...</div>;
  
      if (!user) return null;
      
  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user}/>
      <h1>Your Latest Items</h1>
      <p>List of favorites will go here.</p>
    </div>
  );
}
