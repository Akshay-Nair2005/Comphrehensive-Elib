import { NavLink } from 'react-router-dom'

const Navv = () => {
  const linkClass = ({ isActive }) => isActive ? "bg-button text-[#fff] px-6 py-3 rounded-full shadow-md" : "border-[#E0E0E0] hover:border-[#F87871] transition-all duration-300 px-4 py-3 rounded-full px-6 border text-white/90" ;

  return (
    <nav className="p-4">
      <ul className="flex space-x-6  justify-end mt-3">
        <li>
          <NavLink
            to="/"
            className={linkClass}

          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={linkClass}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={linkClass}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navv
