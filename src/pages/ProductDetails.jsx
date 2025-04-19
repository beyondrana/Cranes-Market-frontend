import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../constants';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/v1/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/get-user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        
        if (res && res.data) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
      fetchCurrentUser();
    }
  }, [productId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleEdit = () => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/v1/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      navigate('/my-profile', { state: { message: 'Product deleted successfully' } });
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product');
      setDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  const isOwner = () => {
    return currentUser && product && currentUser._id === product.user;
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
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Product not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Images Carousel */}
            <div className="md:w-1/2">
              {product.images && product.images.length > 0 ? (
                <div className="relative h-96">
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={`${product.title} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}

              {/* Thumbnail images */}
              {product.images && product.images.length > 1 && (
                <div className="flex p-4 space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`w-20 h-20 cursor-pointer ${currentImageIndex === index ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                
                {/* Edit and Delete buttons if user is the owner */}
                {isOwner() && (
                  <div className="flex space-x-2">
                    {/* <button 
                      onClick={handleEdit}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button> */}
                    <button 
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm"
                    >
                      {deleteConfirm ? 'Confirm' : 'Delete'}
                    </button>
                    {deleteConfirm && (
                      <button 
                        onClick={cancelDelete}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {product.condition}
                </span>
                {product.negotiable && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Negotiable
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Location</h2>
                <p className="text-gray-600">{product.location}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Listed on {formatDate(product.createdAt)}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                {!isOwner() && (
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  >
                    Contact Seller
                  </button>
                )}
                <button 
                  onClick={() => navigate(-1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Back to Listings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;