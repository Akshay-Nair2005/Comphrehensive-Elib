import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footerr = () => {
    return (
        <footer className="bg-gray-800 text-button py-8">
            <div className="container mx-auto text-center">
                <p className="text-lg mb-4">Your footer content here</p>
                <div className="flex justify-center space-x-4">
                    <a href="https://facebook.com" className="text-button text-2xl">
                        <FaFacebook />
                    </a>
                    <a href="https://twitter.com" className="text-button text-2xl">
                        <FaTwitter />
                    </a>
                    <a href="https://instagram.com" className="text-button text-2xl">
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footerr;