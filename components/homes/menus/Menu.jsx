"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
export default function Menu({ setMenuOpen, data }) {
  const pathname = usePathname();

  return (
    <div className="mean-bar">
      <a
        href="#nav"
        className="meanmenu-reveal"
        style={{ right: "0px", left: "auto", display: "inline" }}
      >
        <span>
          <span>
            <span></span>
          </span>
        </span>
      </a>
      <nav className="mean-nav">
        <ul>
          {data.map((elm, i) => (
            <li
              key={i}
              className={` ${i + 1 == data.length && "mean-last"} ${
                pathname == elm.href && "active"
              }  `}
              style={{ paddingTop: "5px", paddingBottom: "4px" }}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              <Link href={elm.href}>
                <span>
                  <i
                    style={{ fontSize: "18px", marginRight: "10px" }}
                    className={elm.icon}
                  ></i>
                </span>
                {elm.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
