import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export const NotFoundPage = () => {
  return (
    <div>
      <section className="text-center flex flex-col justify-center items-center h-[80vh]">
        <FaExclamationTriangle class="text-6xl text-color mb-4 w-28 h-28" />
        <h1 className="text-6xl font-bold mb-4 text-black">404 Not Found</h1>
        <p className="text-xl mb-5 text-black">This page does not exist</p>
        <Link
          to="/"
          className="text-button bg-button  transition-all duration-300 rounded-full px-6 py-3 mt-4"
        >
          Go Back
        </Link>
      </section>
    </div>
  );
};
