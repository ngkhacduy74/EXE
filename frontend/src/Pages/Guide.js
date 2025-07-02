import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Pages/styles/Guide.css';

const guideContents = {
  introduction: `I. THÔNG TIN TỔNG QUAN\nVINSAKY là nền tảng thương mại điện tử hàng đầu Việt Nam chuyên cung cấp thiết bị điện lạnh cho ngành Food & Beverage (F&B). Với sứ mệnh trở thành đối tác tin cậy của các doanh nghiệp trong lĩnh vực ẩm thực và đồ uống, Vinsaky đã khẳng định vị thế của mình trên thị trường thiết bị điện lạnh chuyên nghiệp.\n\nII. LĨNH VỰC HOẠT ĐỘNG\n2.1. Ngành nghề kinh doanh chính\n- Thương mại điện tử: Nền tảng trực tuyến chuyên biệt\n- Thiết bị điện lạnh F&B: Chuyên sâu về thiết bị cho ngành ẩm thực\n- Tư vấn giải pháp: Hỗ trợ khách hàng lựa chọn thiết bị phù hợp\n- Dịch vụ hậu mãi: Bảo hành và bảo trì chuyên nghiệp\n\n2.2. Đối tượng khách hàng\n- Nhà hàng cao cấp và bình dân\n- Chuỗi quán cà phê và trà sữa\n- Khách sạn và resort\n- Căng tin công ty và trường học\n- Cửa hàng thực phẩm và siêu thị\n- Các cơ sở sản xuất thực phẩm`,
  registration: 'Để đăng ký tài khoản Vinsaky:\n1) Truy cập trang chủ\n2) Nhấn "Đăng ký"\n3) Điền thông tin cá nhân\n4) Hoàn tất đăng ký.',
  login: 'Đăng nhập vào hệ thống:\n1) Nhập email\n2) Nhập mật khẩu\n3) Nhấn "Đăng nhập"\n4) Xác thực OTP',
  search: `Tìm kiếm sản phẩm:
- Thông qua thanh search ở phần đầu trang
- Search từ khóa liên quan
- Sử dụng Filter để tinh chỉnh sản phẩm cần tìm kiếm
- Tìm kiếm thông qua AI: bấm vào từ khóa liên quan, bấm từ khóa và sản phẩm xuất hiện
- Tìm kiếm thông qua tư vấn khách hàng: ở chân trang có thể dùng hotline đang hiện lên góc dưới màn hình nếu là máy tính, bấm vào sẽ tới Zalo nếu là điện thoại`,
  product: `Quản lý sản phẩm:
- Vào mục hình người (icon) ở trên cùng
- Chọn vào mục quản lý sản phẩm
- Chọn chỉnh sửa, xóa, xem sản phẩm trên kệ
- Chọn xóa nếu như sản phẩm đã ngừng kinh doanh`,
  aiGuide: `HƯỚNG DẪN SỬ DỤNG TRỢ LÝ AI (CHATBOT)

- Trợ lý AI của Vinsaky Shop luôn xuất hiện ở góc dưới bên phải màn hình dưới dạng biểu tượng chat.
- Để sử dụng, bạn cần đăng nhập tài khoản.
- Nhấn vào biểu tượng chat để mở cửa sổ trò chuyện với AI.
- Bạn có thể:
  • Đặt câu hỏi về sản phẩm, bài viết, thông tin cửa hàng.
  • Sử dụng các nút gợi ý nhanh như: Sản phẩm mới, So sánh sản phẩm, Bài viết mới nhất, Thống kê shop, Tìm kiếm sản phẩm...
  • Gõ nội dung bất kỳ và nhấn Enter hoặc nút gửi để nhận phản hồi từ AI.
  • Nhấn nút "Xóa" để xóa lịch sử trò chuyện.
- Nếu chưa đăng nhập, AI sẽ yêu cầu bạn đăng nhập để tiếp tục sử dụng.
- AI có thể hỗ trợ tìm kiếm, tư vấn, giải đáp thắc mắc về sản phẩm, bài viết, dịch vụ của shop.
- Lưu ý: Lịch sử chat sẽ được lưu cho lần truy cập tiếp theo khi bạn vẫn đăng nhập.

Ví dụ sử dụng AI:
1. Xem chi tiết sản phẩm:
   - Bạn có thể nhập: "Xem chi tiết sản phẩm tủ đông Alaska 500L" hoặc "Chi tiết sản phẩm tủ mát Sanaky 300L".
   - Sau khi AI trả lời, bạn có thể bấm vào tên sản phẩm (nếu có đường link) để chuyển đến trang chi tiết sản phẩm.
2. So sánh sản phẩm:
   - Bạn có thể nhập: "So sánh tủ đông Alaska 500L và tủ đông Sanaky 400L" hoặc "So sánh tủ mát Sanaky và Alaska".
   - AI sẽ trả về bảng so sánh hoặc thông tin nổi bật của từng sản phẩm.
3. Một số từ khóa gợi ý khác:
   - "Sản phẩm mới nhất"
   - "Bài viết mới nhất về bảo quản thực phẩm"
   - "Tìm tủ đông dung tích lớn"
   - "Shop có dịch vụ bảo hành không?"
   - "Thống kê sản phẩm bán chạy"
   - "Tìm kiếm sản phẩm phù hợp cho quán cà phê"

Bạn có thể hỏi AI bất cứ điều gì liên quan đến sản phẩm, dịch vụ, bài viết hoặc thông tin về Vinsaky Shop!`
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
    content: guideContents.product,
    video: require('../Assests/video/video.mp4') 
  },
  {
    id: 6,
    title: 'Hướng dẫn sử dụng AI',
    content: guideContents.aiGuide,
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