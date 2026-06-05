import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import AboutSection from "../components/home/AboutSection";
import ContactSection from "../components/home/ContactSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FeaturedBlogs from "../components/home/FeaturedBlogs";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <ServicesSection />
      <FeaturedBlogs />
      <AboutSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
