"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "@/data/menu";
export default function MenuTwo() {
  const pathname = usePathname();
  return (
    <div className="col-xxl-1 d-xxl-block d-none">
      <div className="bostami-main-menu-wrap">
        <nav className="bastami-main-menu main_menu">
          <ul>
            {menuItems.map((elm, i) => (
              <li className={`${pathname == elm.href && "active"}  `} key={i}>
                <Link href={elm.href}>
                  <span>
                    <i style={{ fontSize: "25px" }} className={elm.icon}></i>
                  </span>
                  {elm.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
