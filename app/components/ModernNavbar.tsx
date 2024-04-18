import { NavLink } from "@remix-run/react";

type NavBoxProps = {
  text: string;
  to: string;
};
type Props = {
  isLoggedIn?: boolean;
};

// Create a new Navbar (Home | Properties | Inbox | Profile) similar to TikTok. (Not started)

const NavBox = ({ text, to }: NavBoxProps) => {
  return (
    <NavLink
      to={to}
      className="w-[25%] flex justify-center items-center h-full border-l-1 text-xs first-of-type:border-l-0 border-custom-secondary"
    >
      <div>
        {/* replace with icons */}
        {text}
      </div>
    </NavLink>
  );
};

const ModernNavbar = ({ isLoggedIn }: Props) => {
  return (
    <>
      {isLoggedIn && (
        <nav className="fixed z-50 h-12 w-screen bottom-0 right-0 bg-custom-primary border-t-1 border-custom-secondary text-white font-bold">
          <div className="flex-wrapper flex h-full">
            <NavBox text="Home" to="/" />
            <NavBox text="Properties" to="property" />
            <NavBox text="Inbox" to="inbox" />
            <NavBox text="Profile" to="profile" />
          </div>
        </nav>
      )}
    </>
  );
};

export default ModernNavbar;
