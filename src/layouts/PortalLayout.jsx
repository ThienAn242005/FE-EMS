import { Outlet } from "react-router-dom";
import Header from "../Portal/Header";
import Footer from "../Portal/Footer";

const PortalLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      {/* Header chiếm diện tích thật, đẩy Main xuống */}
      <Header /> 
      
      {/* Main bắt đầu ngay sau khi Header kết thúc */}
      <main className="flex-grow w-full relative">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default PortalLayout;