type Props = {
  menuItems?: string[];
  isOpen?: boolean;
};

const Sidebar = ({
  menuItems = ["Inbox", "Dashboard", "Logout"],
  isOpen = false,
}: Props) => {
  return (
    <>
      <div
        className={`sidebar w-full fixed ${
          isOpen ? "animate-slide-up" : "animate-slide-down"
        } h-full z-50 bg-white`}
      >
        text
      </div>
    </>
  );
};

export default Sidebar;
