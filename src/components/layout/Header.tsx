import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: "home" },
    { label: "Dịch vụ", href: "services" },
    { label: "Blog", href: "blog" },
    { label: "Về chúng tôi", href: "about" },
    { label: "Liên hệ", href: "contact" },
  ];

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        <a href="/" className="header__logo">
          <Sparkles size={26} color="#C9A84C" />
          <span>
            BEAUTY<strong>CLINIC</strong>
          </span>
        </a>
        <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              className="header__nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#booking" className="header__cta">
          Đặt lịch ngay
        </a>
        <button
          className={`header__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
