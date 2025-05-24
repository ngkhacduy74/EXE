import { useState, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import Header from './Header'; 
import Footer from './Footer';


const styles = {
  container: {
    maxWidth: '42rem',
    margin: '2rem auto',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#2563eb',
    padding: '1rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0
  },
  body: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  formGroupLast: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    color: '#374151',
    fontWeight: 500,
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box'
  },
  radioGroup: {
    display: 'flex',
    gap: '1rem'
  },
  radioLabel: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  radioInput: {
    height: '1rem',
    width: '1rem',
    color: '#2563eb'
  },
  radioText: {
    marginLeft: '0.5rem'
  },
  uploadContainer: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    transition: 'border-color 0.2s'
  },
  uploadContainerSuccess: {
    border: '2px dashed #34d399',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center'
  },
  uploadPlaceholder: {
    padding: '2rem 1rem'
  },
  uploadIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    color: '#4b5563'
  },
  uploadText: {
    color: '#374151',
    marginBottom: '0.5rem'
  },
  uploadButtonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  uploadButton: {
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.25rem',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    border: 'none'
  },
  uploadButtonIcon: {
    marginRight: '0.25rem'
  },
  hiddenInput: {
    display: 'none'
  },
  previewContainer: {
    position: 'relative'
  },
  previewImage: {
    height: '8rem',
    margin: '0 auto',
    borderRadius: '0.25rem',
    objectFit: 'cover',
    width: '100%'
  },
  removeImageBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.25rem',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  submitButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  submitButtonDisabled: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#93c5fd',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'not-allowed'
  },
  successContainer: {
    maxWidth: '42rem',
    margin: '2rem auto',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  successHeading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: '1rem'
  },
  successMessage: {
    marginBottom: '1rem'
  },
  submissionData: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '0.25rem',
    overflow: 'auto',
    maxHeight: '15rem',
    fontSize: '0.875rem'
  },
  createAnotherBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  errorMessage: {
    color: '#ef4444',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem'
  },
  gridMd: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem'
  },
  loadingSpinner: {
    display: 'inline-block',
    marginRight: '0.5rem',
    width: '1rem',
    height: '1rem',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Add CSS animation for spinner
const cssAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Insert the CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = cssAnimation;
  document.head.appendChild(style);
}

export default function NewPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'A',
    status: 'New',
    address: '',
    description: '',
    condition: 'Pending',
    user_position: 'Newbie'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [token, setToken] = useState('');
  const [userEmail, setUserEmail] = useState('user@example.com'); // You can make this dynamic

  // Initialize token from localStorage (simulated)
  useEffect(() => {
    // In a real app, you'd get this from localStorage
    // For demo purposes, we'll simulate having a token
    const simulatedToken = 'demo-token-12345';
    setToken(simulatedToken);
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      videoPreviews.forEach(preview => {
        if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const newImagePreviews = imageFiles.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...imageFiles]);
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      const newVideoPreviews = videoFiles.map(file => URL.createObjectURL(file));
      setVideoFiles(prev => [...prev, ...videoFiles]);
      setVideoPreviews(prev => [...prev, ...newVideoPreviews]);
    }
  };

  const removeImage = (index) => {
    const preview = imagePreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    const preview = videoPreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 6) {
      errors.description = 'Description must be at least 6 characters long';
    } else if (formData.description.length > 1500) {
      errors.description = 'Description cannot exceed 1500 characters';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };

  const isFormValid = () => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would do:
      /*
      const postData = new FormData();
      Object.keys(formData).forEach(key => {
        postData.append(key, formData[key]);
      });
      
      // Append files with the same field name (most common approach)
      imageFiles.forEach((imageFile) => {
        postData.append('images', imageFile);
      });
      videoFiles.forEach((videoFile) => {
        postData.append('videos', videoFile);
      });
      
      postData.append('createdAt', new Date().toISOString());

      const response = await fetch('http://localhost:4000/post/createPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: postData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        } else if (response.status === 400) {
          throw new Error('Invalid form data');
        } else if (response.status === 413) {
          throw new Error('Files too large');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const responseData = await response.json();
      setResponseData(responseData);
      */

      // For demo purposes, create mock response
      const mockResponse = {
        id: 'post_' + Date.now(),
        ...formData,
        images: imageFiles.map(file => file.name),
        videos: videoFiles.map(file => file.name),
        createdAt: new Date().toISOString(),
        status: 'success'
      };
      
      setResponseData(mockResponse);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the post');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'A',
      status: 'New',
      address: '',
      description: '',
      condition: 'Pending',
      user_position: 'Newbie'
    });
    setImageFiles([]);
    setVideoFiles([]);
    
    // Clean up existing previews
    imagePreviews.forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    videoPreviews.forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    
    setImagePreviews([]);
    setVideoPreviews([]);
    setSubmitted(false);
    setError(null);
    setResponseData(null);
  };

  if (submitted) {
    return (
      <div>
        <Header />
        <div style={styles.successContainer}>
          <h2 style={styles.successHeading}>Post Submitted Successfully!</h2>
          <p style={styles.successMessage}>Your product has been posted and is pending review.</p>
          <pre style={styles.submissionData}>
            {JSON.stringify(responseData, null, 2)}
          </pre>
          <button style={styles.createAnotherBtn} onClick={resetForm}>
            Create Another Post
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create New Product Post</h1>
        </div>
        <div style={styles.body}>
          {/* Image Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Images</label>
            <div style={imagePreviews.length > 0 ? styles.uploadContainerSuccess : styles.uploadContainer}>
              {imagePreviews.length > 0 ? (
                <div style={styles.grid}>
                  {imagePreviews.map((preview, index) => (
                    <div key={`image-${index}`} style={styles.previewContainer}>
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                        style={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={styles.removeImageBtn}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div style={{ ...styles.uploadPlaceholder, ...styles.uploadContainer }}>
                    <label style={styles.uploadButton}>
                      <Upload size={16} style={styles.uploadButtonIcon} />
                      Add More
                      <input
                        type="file"
                        accept="image/*"
                        style={styles.hiddenInput}
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <div style={styles.uploadIcon}>
                    <Camera size={48} />
                  </div>
                  <p style={styles.uploadText}>Drag and drop your images here or click to browse</p>
                  <div style={styles.uploadButtonContainer}>
                    <label style={styles.uploadButton}>
                      <Upload size={16} style={styles.uploadButtonIcon} />
                      Select Images
                      <input
                        type="file"
                        accept="image/*"
                        style={styles.hiddenInput}
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Videos</label>
            <div style={videoPreviews.length > 0 ? styles.uploadContainerSuccess : styles.uploadContainer}>
              {videoPreviews.length > 0 ? (
                <div style={styles.grid}>
                  {videoPreviews.map((preview, index) => (
                    <div key={`video-${index}`} style={styles.previewContainer}>
                      <video
                        src={preview}
                        controls
                        style={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        style={styles.removeImageBtn}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div style={{ ...styles.uploadPlaceholder, ...styles.uploadContainer }}>
                    <label style={styles.uploadButton}>
                      <Upload size={16} style={styles.uploadButtonIcon} />
                      Add More
                      <input
                        type="file"
                        accept="video/*"
                        style={styles.hiddenInput}
                        onChange={handleVideoChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <div style={styles.uploadIcon}>
                    <Camera size={48} />
                  </div>
                  <p style={styles.uploadText}>Drag and drop your videos here or click to browse</p>
                  <div style={styles.uploadButtonContainer}>
                    <label style={styles.uploadButton}>
                      <Upload size={16} style={styles.uploadButtonIcon} />
                      Select Videos
                      <input
                        type="file"
                        accept="video/*"
                        style={styles.hiddenInput}
                        onChange={handleVideoChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          {/* Category */}
          <div style={styles.formGroup}>
            <label htmlFor="category" style={styles.label}>Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select a category</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
            </select>
          </div>

          {/* Status */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Status *</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  value="New"
                  checked={formData.status === "New"}
                  onChange={handleInputChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioText}>New</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  value="SecondHand"
                  checked={formData.status === "SecondHand"}
                  onChange={handleInputChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioText}>Second Hand</span>
              </label>
            </div>
          </div>

          {/* User Position */}
          <div style={styles.formGroup}>
            <label style={styles.label}>User Position *</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="user_position"
                  value="Newbie"
                  checked={formData.user_position === "Newbie"}
                  onChange={handleInputChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioText}>Newbie</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="user_position"
                  value="Professional"
                  checked={formData.user_position === "Professional"}
                  onChange={handleInputChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioText}>Professional</span>
              </label>
            </div>
          </div>

          {/* Address */}
          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.formGroupLast}>
            <label htmlFor="description" style={styles.label}>
              Description * ({formData.description.length}/1500)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              style={styles.textarea}
              required
              placeholder="Describe your product in detail (minimum 6 characters)..."
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              style={isLoading || !isFormValid() ? styles.submitButtonDisabled : styles.submitButton}
            >
              {isLoading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Submitting...
                </>
              ) : (
                'Submit Post'
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}