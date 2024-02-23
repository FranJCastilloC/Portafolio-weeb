"use client";

import { menuItemsTwo } from "@/data/menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import Menu from "../menus/Menu";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function HeaderTwo() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const addDarkbg = () => {
    if (
      document.body.style.backgroundImage !=
      "url(/assets/img/bg/page-bg-dark-1.jpg"
    ) {
      document.body.style.backgroundImage =
        "url(/assets/img/bg/page-bg-dark-1.jpg";
      setDarkMode(true);
    }
  };
  const addlightBg = () => {
    if (
      document.body.style.backgroundImage != "url(/assets/img/bg/page-bg-1.jpg)"
    ) {
      document.body.style.backgroundImage = "url(/assets/img/bg/page-bg-1.jpg)";
      setDarkMode(false);
    }
  };
  const handleDarkmode = () => {
    const currentState = localStorage?.getItem("idDarkMode");
    if (JSON.parse(currentState) == true) {
      localStorage.setItem("idDarkMode", false);
      document.body.classList.remove("dark-theme");
      addlightBg();
    } else {
      localStorage?.setItem("idDarkMode", true);
      document.body.classList.add("dark-theme");
      addDarkbg();
    }
  };

  useEffect(() => {
    const currentState = localStorage?.getItem("idDarkMode");
    if (JSON.parse(currentState) == true) {
      document.body.classList.add("dark-theme");
      addDarkbg();
    } else {
      document.body.classList.remove("dark-theme");
      addlightBg();
    }
  }, []);
  return (
    <div className="bostami-header-area mb-80 z-index-5">
      <div className="container">
        <div className="bostami-header-wrap main-style-2">
          <div className="row">
            <div className="col-lg-2 col-md-6 col-sm-4 col-4 d-flex align-items-center">
              <div className="bostami-header-logo">
                <Link className="site-logo" href="/">
                  <Image
                    width={153}
                    height={32}
                    src="/assets/img/logo/logo-2.png"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>

            <div className="col-lg-10 col-md-6 col-sm-8 col-8">
              <div className="header-right-flex">
                <div className="bostami-main-menu-wrap ">
                  <nav className="bastami-main-menu main_menu_2">
                    <ul style={{ display: "flex", alignItems: "center" }}>
                      <li className={pathname == "/home-2" ? "active" : ""}>
                        <Link
                          href="/home-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>
                            <Image
                              width={20}
                              height={20}
                              src="/assets/img/icon/home.png"
                              alt="icon"
                            />
                          </span>
                          home
                        </Link>
                      </li>

                      {menuItemsTwo.map((elm, i) => (
                        <li
                          key={i}
                          className={pathname == elm.href ? "active" : ""}
                        >
                          <Link
                            href={elm.href}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ fontSize: "21px" }}>
                              <i className={elm.icon}></i>
                            </span>
                            <span> {elm.text.toLowerCase()}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="bostami-header-menu-btn text-right ml-30">
                  <div
                    className="dark-btn dark-btn-2 mode-btn"
                    onClick={() => handleDarkmode()}
                  >
                    {darkMode ? (
                      <i className="sunicon fa-light fa-sun-bright"></i>
                    ) : (
                      <i className="moonicon fa-solid fa-moon"></i>
                    )}
                  </div>
                  <div className="menu-btn-wrap d-lg-none">
                    <div
                      className={`menu-btn menu-btn-2 toggle_menu$ {menuOpen && "active"} `}
                      onClick={() => setMenuOpen((pre) => !pre)}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-menu-wrap">
          <div className={`mobile-menu mobile_menu_2 ${menuOpen && "active"} `}>
            <Menu setMenuOpen={setMenuOpen} data={menuItemsTwo} />
          </div>
        </div>
      </div>
    </div>
  );
}
