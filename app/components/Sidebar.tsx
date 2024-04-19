import { Form, NavLink } from "@remix-run/react";
import { MingcuteExitFill } from "./svg/Exit";
import { separateAndCapitalize } from "~/utils/separateAndCapitalize";

type Props = {
  menuItems?: string[];
  isOpen?: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
  menuItems = ["inbox", "dashboard", "logout"],
  isOpen = false,
  setIsSidebarOpen,
}: Props) => {
  return (
    <>
      <div
        className={`sidebar w-full fixed ${
          isOpen ? "animate-slide-up" : "animate-slide-down"
        } h-full z-50 bg-white`}
      >
        <div className="menu-items-wrapper flex flex-col relative items-start justify-start space-y-4 flex-grow">
          {menuItems.map((item, index) => {
            const displayName = separateAndCapitalize(item);
            return (
              <div key={index} className="p-4 w-full">
                {item === "logout" ? (
                  <Form method="post" action="/logout">
                    <button
                      className="text-white flex justify-center items-center gap-2 bg-red-600 p-2 rounded-md mt-auto"
                      onClick={() => setIsSidebarOpen((prev) => !prev)}
                    >
                      <MingcuteExitFill /> <div>{displayName}</div>
                    </button>
                  </Form>
                ) : (
                  <NavLink to={`/${item}`}>
                    <button className="text-black">{displayName}</button>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
