import "./ContactSection.css";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const contactInfo = [
  {
    icon: <Phone size={24} color="#C9A84C" strokeWidth={1.5} />,
    title: "Hotline Tư Vấn",
    details: "+84 (0) 90 123 4567",
    subDetails: "Hỗ trợ 24/7",
  },
  {
    icon: <Mail size={24} color="#C9A84C" strokeWidth={1.5} />,
    title: "Gửi Email",
    details: "booking@auraclinic.vn",
    subDetails: "Phản hồi trong vòng 2 giờ",
  },
  {
    icon: <MapPin size={24} color="#C9A84C" strokeWidth={1.5} />,
    title: "Trụ Sở Chính",
    details: "Quận 1, TP. Hồ Chí Minh",
    subDetails: "Việt Nam",
  },
];

const ContactSection = () => {
  return (
    <section className="contact" id="contact">
      {/* Lớp phủ mờ đen cho ảnh nền */}
      <div className="contact__overlay"></div>

      <div className="contact__container">
        {/* Header */}
        <div className="contact__header">
          <span className="section-tag">ĐẶT LỊCH HẸN</span>
          <h2 className="section-title">
            Đánh Thức <span className="gold">Vẻ Đẹp</span>
          </h2>
          <p className="contact__header-desc">
            Sẵn sàng cho một diện mạo mới hoàn mỹ? Hãy liên hệ ngay hôm nay để
            được các chuyên gia của chúng tôi tư vấn và thiết kế phác đồ điều
            trị chuyên biệt.
          </p>
        </div>

        {/* 3 Thẻ thông tin */}
        <div className="contact__info-cards">
          {contactInfo.map((info, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-card__icon">{info.icon}</div>
              <h3 className="contact-card__title">{info.title}</h3>
              <p className="contact-card__details">{info.details}</p>
              <p className="contact-card__sub">{info.subDetails}</p>
            </div>
          ))}
        </div>

        {/* Form liên hệ */}
        <div className="contact__form-wrapper">
          <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="input-group">
                <label>Họ và Tên</label>
                <input type="text" placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="input-group">
                <label>Số Điện Thoại</label>
                <input type="tel" placeholder="+84 900 000 000" />
              </div>
            </div>

            <div className="input-group">
              <label>Địa Chỉ Email</label>
              <input type="email" placeholder="nguyenvana@example.com" />
            </div>

            <div className="input-group">
              <label>Dịch Vụ Quan Tâm</label>
              <input
                type="text"
                placeholder="VD: Trẻ hóa da công nghệ cao, Nâng cơ, Chăm sóc chuyên sâu..."
              />
            </div>

            <div className="input-group">
              <label>Tình Trạng & Mong Muốn</label>
              <textarea
                rows={4}
                placeholder="Hãy chia sẻ chi tiết về tình trạng hiện tại hoặc mong muốn cải thiện của bạn..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <Send size={18} />
              Đặt Lịch Tư Vấn
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
