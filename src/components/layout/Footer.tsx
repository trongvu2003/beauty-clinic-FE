import "./Footer.css";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              <Sparkles size={24} color="#C9A84C" strokeWidth={1.5} />
              <span>
                AURA<strong>CLINIC</strong>
              </span>
            </a>
            <p className="footer__tagline">
              Viện thẩm mỹ tiêu chuẩn quốc tế hàng đầu tại Việt Nam. Đánh thức
              và tôn vinh vẻ đẹp vượt thời gian của bạn.
            </p>
            <div className="footer__social">
              {["IG", "TW", "FB", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="footer__social-link"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-title">Về AuraClinic</h4>
              {[
                "Về Chúng Tôi",
                "Đội Ngũ Bác Sĩ",
                "Không Gian 5★",
                "Tuyển Dụng",
              ].map((l) => (
                <a key={l} href="#" className="footer__link">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Dịch Vụ Nổi Bật</h4>
              {[
                "Trẻ Hóa Da Công Nghệ Cao",
                "Điều Trị Da Chuyên Sâu",
                "Phẫu Thuật Thẩm Mỹ",
                "Chăm Sóc & Phục Hồi",
              ].map((l) => (
                <a key={l} href="#" className="footer__link">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Liên Hệ</h4>
              <p className="footer__contact-item">
                <MapPin size={16} color="#C9A84C" /> Quận 1, TP. Hồ Chí Minh
              </p>
              <p className="footer__contact-item">
                <Phone size={16} color="#C9A84C" /> +84 (0) 90 123 4567
              </p>
              <p className="footer__contact-item">
                <Mail size={16} color="#C9A84C" /> booking@auraclinic.vn
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 AuraClinic Việt Nam. Đã đăng ký bản quyền.</p>
          <div className="footer__bottom-links">
            <a href="#">Chính Sách Bảo Mật</a>
            <a href="#">Điều Khoản Dịch Vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
