import "./AboutSection.css";
import aboutClinic from "../../assets/images/about-clinic.jpg";

const AboutSection = () => {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <div className="about__content">
          <span className="section-tag">VỀ CHÚNG TÔI</span>
          <h2 className="section-title">
            Kiến Tạo Vẻ Đẹp <span className="gold">Hoàn Mỹ</span>
          </h2>

          <div className="about__text">
            <p>
              BeautyClinic là viện thẩm mỹ tiêu chuẩn quốc tế hàng đầu, mang đến
              các giải pháp làm đẹp công nghệ cao và an toàn tuyệt đối. Chúng
              tôi không chỉ cung cấp dịch vụ thẩm mỹ; chúng tôi đồng hành cùng
              bạn trên hành trình đánh thức phiên bản rạng rỡ nhất của chính
              mình.
            </p>
            <p>
              Từ công nghệ trẻ hóa da không xâm lấn tiên tiến đến các liệu trình
              điều trị chuyên sâu, mỗi dịch vụ tại BeautyClinic đều là sự kết
              tinh hoàn hảo giữa y khoa hiện đại và nghệ thuật chăm sóc sắc đẹp
              cao cấp.
            </p>
          </div>

          <ul className="about__list">
            {[
              "Phác đồ điều trị được cá nhân hóa chuyên biệt cho từng khách hàng",
              "Đội ngũ Bác sĩ da liễu và chuyên gia hàng đầu trực tiếp thăm khám",
              "Cơ sở vật chất chuẩn 5 sao với hệ thống phòng điều trị vô khuẩn",
              "Chuyển giao công nghệ làm đẹp độc quyền từ Hoa Kỳ và Châu Âu",
              "Dịch vụ chăm sóc hậu phẫu tận tâm, đồng hành hỗ trợ 24/7",
              "Sự lựa chọn đáng tin cậy của hàng vạn phái đẹp từ năm 2010",
            ].map((item, index) => (
              <li key={index} className="about__list-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="rgba(201, 168, 76, 0.1)"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="about__stats">
            <div className="stat-item">
              <h4 className="stat-item__number">50k+</h4>
              <span className="stat-item__label">Khách Hàng Hài Lòng</span>
            </div>
            <div className="stat-item">
              <h4 className="stat-item__number">50+</h4>
              <span className="stat-item__label">Công Nghệ Độc Quyền</span>
            </div>
            <div className="stat-item">
              <h4 className="stat-item__number">100%</h4>
              <span className="stat-item__label">Bác Sĩ Chuyên Khoa</span>
            </div>
          </div>
        </div>

        <div className="about__image-wrapper">
          <div className="about__image-overlay"></div>
          <img
            src={aboutClinic}
            alt="Không gian điều trị sang trọng tại viện thẩm mỹ"
            className="about__image"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
