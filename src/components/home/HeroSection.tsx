import { useEffect, useRef } from "react";
import "./HeroSection.css";
import heroBg from "../../assets/images/background.jpg";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.classList.add("animate-in");
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="hero" id="home">
      <div className="hero__bg" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero__bg-overlay" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content" ref={textRef}>
        <span className="hero__badge">Viện Thẩm Mỹ Tiêu Chuẩn Quốc Tế</span>

        <h1 className="hero__title">
          <span className="hero__title-line hero__title-white">Nâng tầm</span>
          <span className="hero__title-line hero__title-gold">
            Vẻ đẹp vượt thời gian
          </span>
        </h1>

        <p className="hero__subtitle">
          Trải nghiệm các dịch vụ làm đẹp công nghệ cao, an toàn tuyệt đối và
          đánh thức vẻ đẹp tự nhiên, rạng rỡ nhất của riêng bạn.
        </p>

        <div className="hero__actions">
          <a href="#services" className="btn btn--gold">
            Khám phá dịch vụ
          </a>
          <a href="#booking" className="btn btn--outline">
            Đặt lịch tư vấn
          </a>
        </div>

        <div className="hero__stats">
          {[
            { value: "15+", label: "Năm kinh nghiệm" },
            { value: "5★", label: "Cơ sở vật chất" },
            { value: "50k+", label: "Khách hàng hài lòng" },
          ].map((s) => (
            <div key={s.label} className="hero__stat">
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="hero__scroll"
        onClick={scrollDown}
        aria-label="Scroll down"
      >
        {/* Màu gold #C9A84C hoàn toàn phù hợp với tone màu thẩm mỹ cao cấp */}
        <ChevronDown color="#C9A84C" size={24} strokeWidth={1.5} />
      </button>
    </section>
  );
};

export default HeroSection;
