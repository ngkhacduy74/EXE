import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, MessageCircle, MapPin, Calendar, User, Phone, Mail, Eye, Flag, Bookmark, ArrowLeft, Camera, Star, Clock, Shield, CheckCircle, ChevronLeft, ChevronRight, Send, MoreHorizontal } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import apiClient from '../Services/api.service';


const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [commentUsers, setCommentUsers] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/post/${postId}`);
        setPost(res.data.data);
        setComments(res.data.data.comments || []);
        setLikeCount(res.data.data.likes?.length || 0);
      } catch (err) {
        setError("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const userIds = comments
      .map(c => c.user)
      .filter(id => id && !commentUsers[id] && /^[a-zA-Z0-9\-]{10,}$/.test(id));
    if (userIds.length === 0) return;
    Promise.all(userIds.map(id =>
      apiClient.get(`/user/${id}`).then(res => ({ id, data: res.data.user?.[0] || res.data.user || res.data }))
    )).then(results => {
      const newUsers = {};
      results.forEach(({ id, data }) => {
        if (data) newUsers[id] = data;
      });
      setCommentUsers(prev => ({ ...prev, ...newUsers }));
    });
  }, [comments]);

  const handleLike = async () => {
    try {
      await apiClient.post(`/post/${postId}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch {}
  };

  const handleFavorite = async () => {
    try {
      await apiClient.post(`/post/${postId}/favorite`);
      setIsFavorited((prev) => !prev);
    } catch {}
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await apiClient.post(`/post/${postId}/comment`, { content: newComment });
      setComments(res.data.comments);
      setNewComment("");
    } catch {}
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === (post?.image?.length - 1) ? 0 : prev + 1
    );
  };
  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? (post?.image?.length - 1) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <Flag size={32} />
          </div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error || 'Không thể tải bài viết hoặc bài viết không tồn tại.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <div className="post-detail">
          {/* Header */}
          <div className="header">
            <div className="header-content">
              <button className="back-button" onClick={() => window.history.back()}>
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>
              <div className="header-actions">
                <button onClick={handleLike} className={`action-button${isLiked ? ' liked' : ''}`}>
                  <Heart size={20} className={isLiked ? 'filled' : ''} />
                  <span>{likeCount}</span>
                </button>
                <button onClick={handleFavorite} className={`action-button${isFavorited ? ' favorited' : ''}`}>
                  <Bookmark size={20} className={isFavorited ? 'filled' : ''} />
                  <span>{isFavorited ? 'Đã lưu' : 'Lưu'}</span>
                </button>
                <button className="action-button">
                  <Share2 size={20} />
                  <span>Chia sẻ</span>
                </button>
                <button className="action-button">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="content-grid">
              {/* Left Column */}
              <div className="left-column">
                {/* Image Gallery */}
                <div className="image-gallery">
                  <div className="main-image-container">
                    <img
                      src={post.image?.[activeImageIndex]}
                      alt={post.title}
                      className="main-image"
                      onClick={() => setIsImageModalOpen(true)}
                    />
                    <div className="status-badge status-active">
                      {post.status === 'available' ? 'Còn hàng' : 'Đã bán'}
                    </div>
                    <div className="image-counter">
                      <Camera size={16} />
                      {activeImageIndex + 1} / {post.image?.length}
                    </div>
                    {post.image?.length > 1 && (
                      <>
                        <button onClick={prevImage} className="image-overlay" style={{ left: 0 }}>
                          <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="image-overlay" style={{ right: 0 }}>
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                  {post.image?.length > 1 && (
                    <div className="thumbnails">
                      <div className="thumbnail-list">
                        {post.image.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`thumbnail${activeImageIndex === index ? ' active' : ''}`}
                          >
                            <img src={image} alt={`Thumb ${index + 1}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Info */}
                <div className="post-info">
                  <div className="post-header">
                    <div className="post-meta">
                      <span className="category-badge">{post.category}</span>
                      <span className="verified-badge">
                        <CheckCircle size={12} /> Đã xác minh
                      </span>
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="price-container">
                      <div className="price">{post.price || 'Liên hệ'}</div>
                      {post.price && <span className="currency">VNĐ</span>}
                    </div>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <Eye size={24} />
                      <div className="stat-number">{post.views?.toLocaleString() || 0}</div>
                      <div className="stat-label">Lượt xem</div>
                    </div>
                    <div className="stat-item">
                      <Heart size={24} />
                      <div className="stat-number">{likeCount}</div>
                      <div className="stat-label">Yêu thích</div>
                    </div>
                    <div className="stat-item">
                      <MessageCircle size={24} />
                      <div className="stat-number">{comments.length}</div>
                      <div className="stat-label">Bình luận</div>
                    </div>
                    <div className="stat-item">
                      <Clock size={24} />
                      <div className="stat-number">{formatDate(post.createdAt).split(',')[0]}</div>
                      <div className="stat-label">Đăng ngày</div>
                    </div>
                  </div>
                  <div className="location-info">
                    <MapPin size={20} />
                    <span>{post.address}</span>
                  </div>
                  <div className="description-section">
                    <h3 className="section-title">
                      <div className="title-accent"></div>
                      Mô tả chi tiết
                    </h3>
                    <p className="description-text">{post.description}</p>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  <h3 className="section-title">
                    <MessageCircle size={16} /> Bình luận ({comments.length})
                  </h3>
                  <div className="comments-list">
                    {comments.length === 0 && (
                      <div className="no-comments">
                        <MessageCircle size={48} />
                        <p>Chưa có bình luận nào</p>
                        <span>Hãy là người đầu tiên bình luận!</span>
                      </div>
                    )}
                    {comments.map((c, idx) => (
                      <div className="comment-item" key={idx}>
                        <div className="comment-header">
                          <div className="comment-avatar">
                            {commentUsers[c.user]?.ava_img_url ? (
                              <img
                                src={commentUsers[c.user].ava_img_url}
                                alt="avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                              />
                            ) : (
                              <User size={24} color="#3b82f6" />
                            )}
                          </div>
                          <div>
                            <span className="comment-author">{c.user}</span>
                            <span className="comment-time"> • {formatDate(c.createdAt)}</span>
                          </div>
                        </div>
                        <div className="comment-content">{c.content}</div>
                      </div>
                    ))}
                  </div>
                  <div className="comment-input-section">
                    <div className="comment-input-container">
                      <div className="input-avatar">B</div>
                      <div className="input-content">
                        <textarea
                          placeholder="Viết bình luận của bạn..."
                          className="comment-textarea"
                          rows="3"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                        />
                        <button onClick={handleComment} className="submit-comment-btn" disabled={!newComment.trim()}>
                          <Send size={16} /> Gửi bình luận
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Seller Info */}
              <div>
                <div className="post-info">
                  <div className="post-header" style={{ textAlign: 'center' }}>
                    <div className="seller-avatar" style={{ margin: '0 auto', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '50%' }}>
                      {post.seller?.ava_img_url || post.seller?.profileImage ? (
                        <img
                          src={post.seller.ava_img_url || post.seller.profileImage}
                          alt="avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <User size={32} color="#3b82f6" />
                      )}
                    </div>
                    <h4 className="seller-name">{post.seller?.fullname}</h4>
                    <div className="seller-position">
                      <Shield size={16} /> Người bán đáng tin cậy
                    </div>
                    <div className="seller-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="star-filled" />
                      ))}
                      <span className="rating-text">(4.8/5)</span>
                    </div>
                  </div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <Phone size={20} />
                      <span>{post.seller?.phone}</span>
                    </div>
                    <div className="contact-item">
                      <Mail size={20} />
                      <span>{post.seller?.email}</span>
                    </div>
                    <div className="contact-item">
                      <MapPin size={20} />
                      <span>{post.seller?.address}</span>
                    </div>
                  </div>
                  <div className="seller-actions">
                    <button className="primary-action-btn">
                      <Phone size={20} /> Liên hệ ngay
                    </button>
                    <button className="secondary-action-btn">
                      <MessageCircle size={20} /> Chat messenger
                    </button>
                    <button className="outline-action-btn">
                      Xem thêm tin đăng
                    </button>
                  </div>
                  <div className="verified-badge" style={{ marginTop: 16 }}>
                    <CheckCircle size={16} /> Đã xác minh danh tính
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img
              src={post.image?.[activeImageIndex]}
              alt={post.title}
              className="modal-image"
            />
            <button className="modal-close" onClick={() => setIsImageModalOpen(false)}>
              ×
            </button>
            {post.image?.length > 1 && (
              <>
                <button onClick={prevImage} className="image-overlay" style={{ left: 0 }}>
                  <ChevronLeft size={32} />
                </button>
                <button onClick={nextImage} className="image-overlay" style={{ right: 0 }}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
          <div className="image-counter">
            {activeImageIndex + 1} / {post.image?.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostView;