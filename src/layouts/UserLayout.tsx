import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FloatingContact from "../components/FloatingContact/FloatingContact";

export default function UserLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <FloatingContact />
      <Footer />
    </>
  );
}
