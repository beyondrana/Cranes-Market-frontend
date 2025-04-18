import React from 'react';
import { X, MapPin, Phone, Mail } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const ProductModal = ({ product, onClose, currentSlide, onSlideChange }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product images */}
            <div className="h-80 md:h-96 bg-gray-100 rounded-lg">
              <ImageCarousel 
                product={product} 
                currentSlide={currentSlide} 
                onSlideChange={onSlideChange}
                isModal={true}
              />
            </div>
            
            {/* Product details */}
            <div>
              {/* Price and condition */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  {product.negotiable && (
                    <span className="ml-2 text-sm text-green-600">(Negotiable)</span>
                  )}
                </div>
                <div className={`px-3 py-1 text-sm rounded-full ${
                  product.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {product.condition}
                </div>
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-gray-800 capitalize">{product.category}</p>
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <div className="flex items-center text-gray-800">
                  <MapPin size={16} className="mr-1" />
                  <span>{product.location}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-800 whitespace-pre-line">{product.description}</p>
              </div>
              
              {/* Seller information */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Seller Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">{product.sellerName || "Seller Name"}</p>
                  
                  {product.sellerPhone && (
                    <div className="flex items-center text-gray-700 mb-2">
                      <Phone size={16} className="mr-2" />
                      <span>{product.sellerPhone}</span>
                    </div>
                  )}
                  
                  {product.sellerEmail && (
                    <div className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-2" />
                      <span>{product.sellerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Posted date */}
              <div className="text-gray-500 text-sm">
                Posted on {formatDate(product.createdAt)}
              </div>
              
              {/* Contact button */}
              <div className="mt-6">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;