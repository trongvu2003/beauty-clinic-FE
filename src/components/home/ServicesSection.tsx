import "./ServicesSection.css";
import {
  ShieldCheck,
  Sparkles,
  Stethoscope,
  HeartHandshake,
  ClipboardList,
  Crown,
} from "lucide-react";
import service1 from "../../assets/images/services/service1.avif";
import service2 from "../../assets/images/services/service2.jpg";
import service3 from "../../assets/images/services/service3.avif";
import service4 from "../../assets/images/services/service4.avif";
import service5 from "../../assets/images/services/service5.avif";
import service6 from "../../assets/images/services/service6.jpg";

const SERVICE_IMAGES = [
  service1,
  service2,
  service3,
  service4,
  service5,
  service6,
];

const ITEM_WIDTH = 380;
const ITEM_GAP = 20;

const services = [
  {
    icon: <ShieldCheck size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "An Toàn Chuẩn Y Khoa",
    description:
      "Quy trình làm đẹp vô khuẩn, tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế và được cấp phép bởi Bộ Y Tế.",
  },
  {
    icon: <Sparkles size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Công Nghệ Tiên Tiến",
    description:
      "Ứng dụng hệ thống máy móc, công nghệ thẩm mỹ hiện đại nhất được chuyển giao trực tiếp từ Hoa Kỳ và Châu Âu.",
  },
  {
    icon: <Stethoscope size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Chuyên Gia Hàng Đầu",
    description:
      "Trực tiếp thăm khám và điều trị bởi đội ngũ Bác sĩ Da liễu và Chuyên gia Thẩm mỹ có hơn 15 năm kinh nghiệm.",
  },
  {
    icon: <ClipboardList size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Phác Đồ Cá Nhân Hóa",
    description:
      "Mỗi khách hàng được thiết kế một phác đồ điều trị riêng biệt, tối ưu hóa theo từng tình trạng cơ địa và mong muốn.",
  },
  {
    icon: <HeartHandshake size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Chăm Sóc Hậu Phẫu 24/7",
    description:
      "Đội ngũ y tá đồng hành chu đáo, theo dõi sát sao quá trình phục hồi để đảm bảo kết quả hoàn mỹ nhất.",
  },
  {
    icon: <Crown size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Không Gian Đẳng Cấp 5★",
    description:
      "Trải nghiệm dịch vụ làm đẹp trong không gian riêng tư, tinh tế mang đậm dấu ấn sang trọng và thư giãn.",
  },
];

const count = SERVICE_IMAGES.length;
const oneSetPx = count * (ITEM_WIDTH + ITEM_GAP);
const duration = oneSetPx / 80;

const ServicesSection = () => {
  return (
    <section className="services" id="services">
      <div className="services__container">
        <div className="services__header">
          <span className="section-tag">GIÁ TRỊ CỐT LÕI</span>
          <h2 className="section-title">
            Đặc Quyền <span className="gold">Thượng Lưu</span>
          </h2>
          <p className="services__header-desc">
            Tận hưởng không gian làm đẹp sang trọng cùng các liệu trình chuyên
            sâu, được thiết kế riêng biệt để đánh thức và tôn vinh vẻ đẹp tự
            nhiên của bạn.
          </p>
        </div>

        {/* ── Carousel ảnh dịch vụ ── */}
        <div className="svc-carousel__viewport">
          <div
            className="svc-carousel__track"
            style={
              {
                "--one-set-px": `${oneSetPx}px`,
                "--duration": `${duration}s`,
              } as React.CSSProperties
            }
          >
            {[...SERVICE_IMAGES, ...SERVICE_IMAGES].map((src, i) => (
              <div className="svc-carousel__item" key={i}>
                <img
                  src={src}
                  alt={services[i % count]?.title ?? ""}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Grid thông tin dịch vụ ── */}
        <div className="services__grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
