import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../constants';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/v1/get-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res || !res.data) {
        throw new Error("User Fetching Failed");
      }
      
      setUser(res.data.user);
      
      // Fetch user's products
      if (res.data.user.products && res.data.user.products.length > 0) {
        await fetchUserProducts(res.data.user.products);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProducts = async (productIds) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/products/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (res && res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Error fetching user products:", error);
      setError("Failed to load product data. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.phone}</p>
              <p className="text-gray-500 text-sm mt-2">Member since {formatDate(user.createdAt)}</p>
              <div className="mt-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* My Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't added any products yet.</p>
              <button 
                onClick={() => navigate('/add-product')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{product.title}</h3>
                    <p className="text-blue-600 font-medium">${product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{formatDate(product.createdAt)}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        {product.condition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;