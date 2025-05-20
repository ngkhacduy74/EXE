import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';

export default function NewPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'A',
    status: 'New',
    address: '',
    description: '',
    condition: 'pending',
    createdAt: null,
    image: null
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData({
        ...formData,
        image: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set the createdAt timestamp at submission time
    const submissionData = {
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    console.log('Form submitted with data:', submissionData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Post Submitted Successfully!</h2>
        <p className="mb-4">Your product has been posted and is pending review.</p>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-sm">
          {JSON.stringify(
            {
              ...formData,
              image: formData.image ? formData.image.name : null,
              createdAt: new Date().toISOString()
            }, 
            null, 2
          )}
        </pre>
        <button 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setFormData({
              title: '',
              category: 'A',
              status: 'New',
              address: '',
              description: '',
              condition: 'pending',
              createdAt: null,
              image: null
            });
            setPreviewUrl(null);
            setSubmitted(false);
          }}
        >
          Create Another Post
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h1 className="text-xl font-bold text-white">Create New Product Post</h1>
      </div>
      
      <div className="p-6">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Product Image or Video
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              previewUrl ? 'border-green-400' : 'border-gray-300 hover:border-blue-400'
            } transition-colors`}
          >
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Product preview" 
                  className="max-h-64 mx-auto rounded"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFormData({...formData, image: null});
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="py-8">
                <div className="flex justify-center mb-2">
                  <Camera size={48} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Drag and drop your image here or click to browse</p>
                <div className="flex justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center">
                    <Upload size={16} className="mr-1" />
                    Select File
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="New"
                checked={formData.status === "New"}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">New</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="SecondHand"
                checked={formData.status === "SecondHand"}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">SecondHand</span>
            </label>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
}