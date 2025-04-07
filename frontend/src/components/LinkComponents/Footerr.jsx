import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";

const Footerr = () => {
  return (
    <footer className="bg-[#5E3023] text-button py-8">
      <div className="container mx-auto text-center">
        <p className="text-lg mb-4">Connect with us on social media</p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-button text-2xl"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/akshayy_nairr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-button text-2xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-button text-2xl"
          >
            <FaTelegram />
          </a>
        </div>
        <p className="text-sm mt-4 text-gray-300">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footerr;
