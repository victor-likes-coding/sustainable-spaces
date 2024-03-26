import { Link } from "@remix-run/react";

type Props = {
  className?: string;
  isVisible?: boolean;
};

const Footer = ({ className = "", isVisible }: Props) => {
  return (
    <footer
      className={`bg-dark text-white p-4 text-[.6rem] px-8 relative z-100 bottom-0 left-0 xsmall:${
        isVisible ? "block" : "hidden"
      }`
        .concat(className)
        .trim()}
    >
      <nav className="flex justify-between flex-wrap">
        <div className="col-wrapper flex flex-col gap-2">
          <div className="underline">Useful Links</div>
          <Link to={{ pathname: "/" }}>Home</Link>
          <Link to="/about">About</Link>
          <Link
            className="cursor-not-allowed"
            to="/#"
            aria-disabled
            onClick={(e) => e.preventDefault()}
          >
            Services
          </Link>
          <Link to="/privacy">
            Privacy <span className="hidden">Policy</span>
          </Link>
          <Link to="/tos">
            Terms <span className="hidden">and Conditions</span>
          </Link>
        </div>
        <div className="col-wrapper flex flex-col gap-2">
          <div className="underline">Community</div>
          <Link to="/help">Help</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/forum">Forum</Link>
          <Link to="/support">Support</Link>
        </div>

        <div className="col-wrapper flex flex-col gap-2">
          <div className="underline">Contact</div>
          <Link to="mailto:some-email@email.com" target="__blank">
            some-email@email.com
          </Link>
          <Link to="tel:+1-800-123-4567" target="__blank">
            +1 (800) 123-4567
          </Link>
          <div>New York, NY 10012, US</div>
        </div>
        <div className="flex w-full justify-around"></div>
      </nav>
    </footer>
  );
};

export default Footer;
