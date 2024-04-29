import { Form, NavLink } from "@remix-run/react";
import { MingcuteExitFill } from "./svg/Exit";
import { separateAndCapitalize } from "~/utils/separateAndCapitalize";

type Props = {
  menuItems?: string[];
  isOpen?: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
  menuItems = ["addListing", "inbox", "dashboard", "logout"],
  isOpen = true,
  setIsSidebarOpen,
}: Props) => {
  return (
    <>
      <div
        className={`sidebar w-full fixed ${
          isOpen ? "animate-slide-up" : "animate-slide-down"
        } h-full z-50 bg-white`}
      >
        <div className="menu-items-wrapper divide-y-1 flex flex-col relative items-start justify-start flex-grow">
          {menuItems.map((item, index) => {
            const displayName = separateAndCapitalize(item);
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <NavLink
                className="p-4 py-6 w-full"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                to={`/${item === "addListing" ? "property/add" : item}`}
                key={index}
              >
                {item === "logout" ? (
                  <Form method="post" action="/logout">
                    <button
                      className="text-white flex justify-center items-center gap-2 bg-red-600 p-2 rounded-md mt-auto"
                      type="button"
                    >
                      <MingcuteExitFill /> <div>{displayName}</div>
                    </button>
                  </Form>
                ) : (
                  <button className="text-black" type="button">
                    {displayName}
                  </button>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
