import { useState, useEffect } from "react";
import { Camera, Upload, X } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

// ... existing styles (unchanged from your original code) ...
const styles = {
  container: {
    maxWidth: "42rem",
    margin: "2rem auto",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "white",
    margin: 0,
  },
  body: {
    padding: "1.5rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  formGroupLast: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    color: "#374151",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    resize: "vertical",
    outline: "none",
  },
  radioGroup: {
    display: "flex",
    gap: "1rem",
  },
  radioLabel: {
    display: "inline-flex",
    alignItems: "center",
  },
  radioInput: {
    height: "1rem",
    width: "1rem",
    color: "#2563eb",
  },
  radioText: {
    marginLeft: "0.5rem",
  },
  uploadContainer: {
    border: "2px dashed #d1d5db",
    borderRadius: "0.5rem",
    padding: "1rem",
    textAlign: "center",
    transition: "border-color 0.2s",
  },
  uploadContainerSuccess: {
    border: "2px dashed #34d399",
    borderRadius: "0.5rem",
    padding: "1rem",
    textAlign: "center",
  },
  uploadPlaceholder: {
    padding: "2rem 1rem",
  },
  uploadIcon: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.5rem",
    color: "#4b5563",
  },
  uploadText: {
    color: "#374151",
    marginBottom: "0.5rem",
  },
  uploadButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  uploadButton: {
    cursor: "pointer",
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "0.25rem",
    display: "inline-flex",
    alignItems: "center",
    transition: "background-color 0.2s",
  },
  uploadButtonIcon: {
    marginRight: "0.25rem",
  },
  hiddenInput: {
    display: "none",
  },
  previewContainer: {
    position: "relative",
  },
  previewImage: {
    height: "8rem",
    margin: "0 auto",
    borderRadius: "0.25rem",
    objectFit: "cover",
    width: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "9999px",
    padding: "0.25rem",
    lineHeight: 1,
    cursor: "pointer",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitButton: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  submitButtonDisabled: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#93c5fd",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "not-allowed",
  },
  successContainer: {
    maxWidth: "42rem",
    margin: "2rem auto",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  successHeading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#059669",
    marginBottom: "1rem",
  },
  successMessage: {
    marginBottom: "1rem",
  },
  submissionData: {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "0.25rem",
    overflow: "auto",
    maxHeight: "15rem",
    fontSize: "0.875rem",
  },
  createAnotherBtn: {
    marginTop: "1rem",
    padding: "0.5rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorMessage: {
    color: "#ef4444",
    marginTop: "0.5rem",
    fontSize: "0.875rem",
  },
};

export default function NewPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "A",
    status: "New",
    address: "",
    description: "",
    condition: "Pending",
    user_position: "Newbie",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch token if not present
  useEffect(() => {
    const fetchToken = async () => {
      // Replace with actual email source (e.g., from context, auth state, or user input)
      const userEmail = "user@example.com"; // Placeholder: Replace with actual email
      if (!token) {
        try {
          const response = await fetch(
            `${
              process.env.BACKEND_API
            }/auth/getUserByEmail?email=${encodeURIComponent(userEmail)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("User not found");
            }
            throw new Error("Failed to fetch user data");
          }
          const userData = await response.json();
          // Assuming the API returns a token field; adjust based on actual response
          const fetchedToken = userData.token;
          if (fetchedToken) {
            setToken(fetchedToken);
            localStorage.setItem("token", fetchedToken);
          } else {
            throw new Error("No token received from server");
          }
        } catch (err) {
          setError(`Authentication error: ${err.message}`);
        }
      }
    };
    fetchToken();

    // Clean up object URLs
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      videoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews, videoPreviews, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const newImagePreviews = imageFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImageFiles((prev) => [...prev, ...imageFiles]);
      setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const videoFiles = files.filter((file) => file.type.startsWith("video/"));
      const newVideoPreviews = videoFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setVideoFiles((prev) => [...prev, ...videoFiles]);
      setVideoPreviews((prev) => [...prev, ...newVideoPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const preview = prev[index];
      URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => {
      const preview = prev[index];
      URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.category.trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setIsLoading(true);

    try {
      const postData = new FormData();
      Object.keys(formData).forEach((key) => {
        postData.append(key, formData[key]);
      });
      imageFiles.forEach((imageFile, index) => {
        postData.append(`image[${index}]`, imageFile);
      });
      videoFiles.forEach((videoFile, index) => {
        postData.append(`video[${index}]`, videoFile);
      });
      postData.append("createdAt", new Date().toISOString());

      const response = await fetch(`${process.env.BACKEND_API}/product/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: postData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or missing token");
        }
        throw new Error("Failed to submit post");
      }

      const responseData = await response.json();
      setResponseData(responseData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "An error occurred while creating the post");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "A",
      status: "New",
      address: "",
      description: "",
      condition: "Pending",
      user_position: "Newbie",
    });
    setImageFiles([]);
    setVideoFiles([]);
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    videoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setVideoPreviews([]);
    setSubmitted(false);
    setError(null);
    setResponseData(null);
  };

  if (submitted) {
    return (
      <div style={styles.successContainer}>
        <h2 style={styles.successHeading}>Post Submitted Successfully!</h2>
        <p style={styles.successMessage}>
          Your product has been posted and is pending review.
        </p>
        <pre style={styles.submissionData}>
          {JSON.stringify(
            responseData || {
              ...formData,
              images: imageFiles.map((file) => file.name),
              videos: videoFiles.map((file) => file.name),
              createdAt: new Date().toISOString(),
            },
            null,
            2
          )}
        </pre>
        <button style={styles.createAnotherBtn} onClick={resetForm}>
          Create Another Post
        </button>
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
            <div
              style={
                imagePreviews.length > 0
                  ? styles.uploadContainerSuccess
                  : styles.uploadContainer
              }
            >
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                  <div
                    style={{
                      ...styles.uploadPlaceholder,
                      ...styles.uploadContainer,
                    }}
                  >
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
                  <p style={styles.uploadText}>
                    Drag and drop your images here or click to browse
                  </p>
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
            <div
              style={
                videoPreviews.length > 0
                  ? styles.uploadContainerSuccess
                  : styles.uploadContainer
              }
            >
              {videoPreviews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                  <div
                    style={{
                      ...styles.uploadPlaceholder,
                      ...styles.uploadContainer,
                    }}
                  >
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
                  <p style={styles.uploadText}>
                    Drag and drop your videos here or click to browse
                  </p>
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
            <label htmlFor="title" style={styles.label}>
              Title *
            </label>
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
            <label htmlFor="category" style={styles.label}>
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Status */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
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
                <span style={styles.radioText}>SecondHand</span>
              </label>
            </div>
          </div>

          {/* User Position */}
          <div style={styles.formGroup}>
            <label style={styles.label}>User Position</label>
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
            <label htmlFor="address" style={styles.label}>
              Address *
            </label>
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
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              style={styles.textarea}
              required
            />
          </div>

          {/* Error message */}
          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Submit Button */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              style={
                isLoading || !isFormValid()
                  ? styles.submitButtonDisabled
                  : styles.submitButton
              }
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      marginRight: "0.5rem",
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></span>
                  Submitting...
                </>
              ) : (
                "Submit Post"
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
