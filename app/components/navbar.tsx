import { Link } from "@remix-run/react";
import Logo from "../assets/images/logo-transparent.png";

type Props = {
  className?: string;
};

const Navbar = ({ className }: Props) => {
  return (
    <nav
      className={`w-screen bg-primary sticky top-0 left-0 px-2 pr-4 border-b border-b-green-700 z-10 ${
        className ? className : ""
      }`.trim()}
    >
      <div className="brand-wrapper flex items-center font-bold text-green-700">
        <div className="logo-wrapper w-12">
          <Link to={{ pathname: "/" }}>
            <img src={Logo} alt="logo" className="w-full" />
          </Link>
        </div>
        <div className="text-sm relative right-1 hidden">
          Sustainable Spaces
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
