"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useLogout } from "../auth/configureAuth";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import FiverrLogo from "../static/FiverrLogo";
import ContextMenu from "./ContextMenu";
import { getIsSeller, saveIsSeller } from "@/services/userRole";
import { links } from "@/utils/navLinks";

const Navbar = () => {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [searchData, setSearchData] = useState("");
  const [navFixed, setNavFixed] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isSeller, setIsSeller] = useState(getIsSeller());

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/");
  };

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    const newIsSeller = !isSeller;
    setIsSeller(newIsSeller);
    saveIsSeller(newIsSeller);

    if (newIsSeller) {
      router.push("/seller");
    } else {
      router.push("/buyer/orders");
    }
  };

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      e.stopPropagation();

      if (isContextMenuVisible) setIsContextMenuVisible(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", clickListener);
    }
    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [isContextMenuVisible]);

  const ContextMenuData = [
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();

        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();

        setIsContextMenuVisible(false);
        handleLogout();
      },
    },
  ] as Array<{ name: string; callback: (e: React.MouseEvent) => void }>;

  useEffect(() => {
    if (pathname === "/") {
      const positionNavbar = () => {
        window.scrollY > 0 ? setNavFixed(true) : setNavFixed(false);
      };
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setNavFixed(true);
    }
  }, [pathname]);

  return (
    <>
      {!isLoading && (
        <nav
          className={`w-full px-24 flex justify-between items-center py-6  top-0 z-30 transition-all duration-300 ${
            navFixed || user
              ? "fixed bg-white border-b border-gray-200"
              : "absolute bg-transparent border-transparent"
          }`}
        >
          <div>
            <Link href="/">
              <FiverrLogo
                fillColor={!navFixed && !user ? "#ffffff" : "#404145"}
              />
            </Link>
          </div>
          <div
            className={`flex ${navFixed || user ? "opacity-100" : "opacity-0"}`}
          >
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="w-[30rem] py-2.5 px-4 border"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
            <button
              className="bg-gray-900 py-1.5 text-white w-16 flex justify-center items-center"
              onClick={() => {
                setSearchData("");
                router.push(`/search?q=${searchData}`);
              }}
            >
              <IoSearchOutline className="fill-white text-white h-6 w-6" />
            </button>
          </div>
          {!user ? (
            <ul className="flex gap-10 items-center">
              {links.map(({ linkName, href, type }) => {
                return (
                  <li
                    key={linkName}
                    className={`${
                      navFixed ? "text-black" : "text-white"
                    } font-medium`}
                  >
                    {type === "link" && <Link href={href}>{linkName}</Link>}
                    {type === "button" && (
                      <Link href={href}>
                        <button>{linkName}</button>
                      </Link>
                    )}
                    {type === "button2" && (
                      <Link href={href}>
                        <button
                          className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                            navFixed
                              ? "border-[#1DBF73] text-[#1DBF73]"
                              : "border-white text-white"
                          } hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500`}
                        >
                          {linkName}
                        </button>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="flex gap-10 items-center">
              {isSeller && (
                <li
                  className="cursor-pointer text-[#1DBF73] font-medium"
                  onClick={() => router.push("/seller/gigs/create")}
                >
                  Create Gig
                </li>
              )}
              <li
                className="cursor-pointer text-[#1DBF73] font-medium"
                onClick={handleOrdersNavigate}
              >
                Orders
              </li>

              {isSeller ? (
                <li
                  className="cursor-pointer font-medium"
                  onClick={handleModeSwitch}
                >
                  Switch To Buyer
                </li>
              ) : (
                <li
                  className="cursor-pointer font-medium"
                  onClick={handleModeSwitch}
                >
                  Switch To Seller
                </li>
              )}
              <li
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContextMenuVisible(true);
                }}
                title="Profile"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative">
                    <span className="text-xl text-white">
                      {user &&
                        user?.email &&
                        user?.email.split("")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </li>
            </ul>
          )}
          {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
        </nav>
      )}
    </>
  );
};

export default Navbar;

//   return (
//     <nav className="bg-white px-4 py-2 flex justify-between items-center shadow-md">
//       <Link href="/" className="text-xl font-bold">
//         <FiverrLogo fillColor={"#1DBF73"} />
//       </Link>
//       <div className="flex">
//         <input
//           type="text"
//           className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
//           value={searchData}
//           onChange={(e) => setSearchData(e.target.value)}
//           placeholder="Search..."
//         />
//         <button
//           type="submit"
//           className="absolute right-2.5 bottom-2.5 bg-blue-500 text-white font-bold text-xs px-4 py-1 rounded shadow hover:bg-blue-400 focus:outline-none focus:ring"
//           onClick={() => router.push(`/search?q=${searchData}`)}
//         >
//           <IoSearchOutline className="text-xl" />
//         </button>
//       </div>
//       <div>
//         {isLoading ? (
//           <div className="flex items-center space-x-4"> Loading...</div>
//         ) : user ? (
//           <div className="flex items-center space-x-4">
//             <span className="text-sm">{user.email}</span>
//             {user.profileImage && (
//               <Image
//                 src={user.profileImage}
//                 alt="Profile"
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//                 style={{ width: "auto", height: "auto" }}
//               />
//             )}
//             <button
//               className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400"
//               disabled={logout.isLoading}
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center space-x-4">
//             <button
//               className="text-blue-500 hover:text-blue-400"
//               onClick={() => router.push("/?signin=true")}
//             >
//               Sign In
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
