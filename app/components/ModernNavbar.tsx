import { NavLink } from "@remix-run/react";
import { GgProfile } from "./svg/Profile";
import { IcRoundHome } from "./svg/Home";
import { MdiHomeGroup } from "./svg/Properties";
import { CharmMenuHamburger } from "./svg/Hamburger";

interface WithIconProps {
  icon: React.ReactNode;
}

interface WithOnClickProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface NavPopupProps extends WithIconProps, WithOnClickProps {}

interface NavBoxProps extends WithIconProps {
  to: string;
}
type Props = {
  isLoggedIn?: boolean;
  size?: {
    height: string;
    width: string;
  };
};

// Create a new Navbar (Home | Properties | Inbox | Profile) similar to TikTok. (Not started)

const NavBox = ({ icon, to }: NavBoxProps) => {
  return (
    <NavLink
      to={to}
      className="w-[25%] flex justify-center items-center h-full border-l-1 text-xs first-of-type:border-l-0 border-custom-secondary"
    >
      <div>
        {/* replace with icons */}
        {icon}
      </div>
    </NavLink>
  );
};

const NavPopUp = ({ icon, onClick }: NavPopupProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[25%] flex justify-center items-center h-full border-l-1 text-xs border-custom-secondary outline-none"
    >
      {icon}
    </button>
  );
};

const ModernNavbar = ({
  isLoggedIn,
  size = {
    height: "1.75rem",
    width: "1.75rem",
  },
}: Props) => {
  return (
    <>
      {isLoggedIn && (
        <nav className="sticky z-50 h-12 w-screen bottom-0 right-0 bg-custom-primary border-t-1 border-custom-secondary text-white font-bold">
          <div className="flex-wrapper flex h-full">
            <NavBox icon={<IcRoundHome {...size} />} to="/" />
            <NavBox icon={<MdiHomeGroup {...size} />} to="property" />
            <NavBox icon={<GgProfile {...size} />} to="profile" />
            <NavPopUp
              icon={<CharmMenuHamburger {...size} />}
              onClick={(e) => {
                e.preventDefault();
                console.log("clicked");
              }}
            />
          </div>
        </nav>
      )}
    </>
  );
};

export default ModernNavbar;
