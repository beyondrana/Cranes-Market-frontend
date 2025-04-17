import React, { useState,useRef } from 'react';
import axios from 'axios';

const ProductUploadForm = () => {
    const currentUser={
        _id:"123",
      }
    //   instead of dummy data get current user from data base else it will give error as schema is asking for an BSON object
    // also one thing missing here is that after uploading of product we need to  add product id to user database
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'used',
    negotiable: false,
    user: currentUser?._id || ''
  });
  
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 4) {
//       setError('Maximum 4 images allowed');
//       return;
//     }
//     setFiles(Array.from(e.target.files));
//     setError('');
//   };

const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Check if adding these files would exceed the 4-image limit
    if (files.length + newFiles.length > 4) {
      setError('You can upload maximum 4 images');
      return;
    }
    
    // Filter out duplicates by name
    const uniqueNewFiles = newFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name)
    );
    
    setFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
    setError('');
    e.target.value = ''; // Reset file input
  };
//   const handleRemoveImage = (index) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);
//   };

const handleAddMoreImages = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (files.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const formDataToSend = new FormData();
      
      // Append product data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append images
      files.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      await axios.post('http://localhost:5000/api/v1/add-product', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        condition: 'used',
        negotiable: false,
        user: currentUser?._id || ''
      });
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sell Your Item</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Product uploaded successfully!</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Max 4)</label>
          <input 
            type="file" 
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-3">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images ({files.length}/4)
          </label>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Display selected images */}
          <div className="flex flex-wrap gap-4 mt-3">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name} 
                  className="w-20 h-20 object-cover rounded"
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            
            {/* Add more button (only shows if we have less than 4 images) */}
            {files.length < 4 && (
              <button
                type="button"
                onClick={handleAddMoreImages}
                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
              >
                <span>+ Add</span>
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="vehicles">Vehicles</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="negotiable"
            checked={formData.negotiable}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Price is negotiable</label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : 'Post Ad'}
        </button>
      </form>
    </div>
    
);
};

export default ProductUploadForm;