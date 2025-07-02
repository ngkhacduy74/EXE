import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Pages/styles/Guide.css';

const guideTopics = [
  { 
    id: 1, 
    title: 'Giới thiệu', 
    content: 'Vinsaky - nền tảng mua bán thiết bị điện lạnh F&B hàng đầu. Cung cấp tủ lạnh, máy làm đá, máy pha cà phê và các thiết bị chuyên nghiệp cho nhà hàng, quán cà phê. Giao diện dễ sử dụng, hỗ trợ 24/7, giá cạnh tranh.', 
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 2, 
    title: 'Cách đăng ký', 
    content: 'Hướng dẫn đăng ký tài khoản.', 
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 3, 
    title: 'Cách đăng nhập', 
    content: 'Hướng dẫn đăng nhập vào hệ thống.', 
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 4, 
    title: 'Tìm kiếm sản phẩm', 
    content: 'Hướng dẫn tìm kiếm sản phẩm.', 
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 5, 
    title: 'Quản lý tài khoản', 
    content: 'Hướng dẫn quản lý tài khoản cá nhân.', 
    video: require('../Assests/video/video.mp4') 
  },
];

function Guide() {
  const [selectedTopic, setSelectedTopic] = useState(guideTopics[0]);

  return (
    <>
      <Header />
      <div className="content-wrapper mt-5 py-4">
        <div className="guide-container">
          <div className="guide-sidebar">
            <h4>Hướng dẫn</h4>
            <ul>
              {guideTopics.map((topic) => (
                <li
                  key={topic.id}
                  className={selectedTopic.id === topic.id ? 'active' : ''}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="guide-content">
            <div className="guide-video">
              <video width="100%" height="320" controls>
                <source src={selectedTopic.video} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
            <div className="guide-text">
              <h5>{selectedTopic.title}</h5>
              <p>{selectedTopic.content}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Guide; 