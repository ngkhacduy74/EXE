import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Pages/styles/Guide.css';

const guideContents = {
  introduction: `I. THÔNG TIN TỔNG QUAN\nVINSAKY là nền tảng thương mại điện tử hàng đầu Việt Nam chuyên cung cấp thiết bị điện lạnh cho ngành Food & Beverage (F&B). Với sứ mệnh trở thành đối tác tin cậy của các doanh nghiệp trong lĩnh vực ẩm thực và đồ uống, Vinsaky đã khẳng định vị thế của mình trên thị trường thiết bị điện lạnh chuyên nghiệp.\n\nII. LĨNH VỰC HOẠT ĐỘNG\n2.1. Ngành nghề kinh doanh chính\n- Thương mại điện tử: Nền tảng trực tuyến chuyên biệt\n- Thiết bị điện lạnh F&B: Chuyên sâu về thiết bị cho ngành ẩm thực\n- Tư vấn giải pháp: Hỗ trợ khách hàng lựa chọn thiết bị phù hợp\n- Dịch vụ hậu mãi: Bảo hành và bảo trì chuyên nghiệp\n\n2.2. Đối tượng khách hàng\n- Nhà hàng cao cấp và bình dân\n- Chuỗi quán cà phê và trà sữa\n- Khách sạn và resort\n- Căng tin công ty và trường học\n- Cửa hàng thực phẩm và siêu thị\n- Các cơ sở sản xuất thực phẩm`,
  registration: 'Để đăng ký tài khoản Vinsaky:\n1) Truy cập trang chủ\n2) Nhấn "Đăng ký"\n3) Điền thông tin cá nhân\n4) Hoàn tất đăng ký.',
  login: 'Đăng nhập vào hệ thống: 1) Nhập email/số điện thoại, 2) Nhập mật khẩu, 3) Nhấn "Đăng nhập". Có thể đăng nhập bằng Google hoặc Facebook.',
  search: 'Tìm kiếm sản phẩm: 1) Sử dụng thanh tìm kiếm, 2) Lọc theo danh mục, 3) Sắp xếp theo giá/đánh giá, 4) Xem chi tiết sản phẩm.',
  account: 'Quản lý tài khoản: Cập nhật thông tin cá nhân, xem lịch sử đơn hàng, theo dõi giao hàng, thay đổi mật khẩu và cài đặt thông báo.'
};

const guideTopics = [
  { 
    id: 1, 
    title: 'Giới thiệu', 
    content: guideContents.introduction,
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 2, 
    title: 'Cách đăng ký', 
    content: guideContents.registration,
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 3, 
    title: 'Cách đăng nhập', 
    content: guideContents.login,
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 4, 
    title: 'Tìm kiếm sản phẩm', 
    content: guideContents.search,
    video: require('../Assests/video/video.mp4') 
  },
  { 
    id: 5, 
    title: 'Quản lý tài khoản', 
    content: guideContents.account,
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
              <p className="multiline-text">{selectedTopic.content}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Guide; 