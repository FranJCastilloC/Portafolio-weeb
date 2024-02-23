"use client";

import { menuItemsThree } from "@/data/menu";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderThree() {
  const pathname = usePathname();
 

  return (
    <div className="text-right">
      <div className="bostami-main-menu-wrap">
        <nav className="bastami-main-menu main_menu_3">
          <ul>
            {menuItemsThree.map((elm, i) => (
              <li key={i} className={pathname == elm.href ? "active" : ""}>
                <Link
                  href={elm.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "24px", marginBottom: "12px" }}>
                    <i className={elm.icon}></i>
                  </span>
                  <div> {elm.text}</div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
