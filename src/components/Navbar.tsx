"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useLogout } from "../request-query/configRequests";
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
                    height="0"
                    width="0"
                    sizes="100vw"
                    className="rounded-full object-cover w-14 h-14"
                    priority
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
