import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="hero-area">
      <div className="container">
        <div className="content-flex">
          <div className="hero-content-wrap">
            <Image
              width={195}
              height={40}
              className="site-logo fadeup"
              src="/assets/img/logo-preview.png"
              alt="preview"
            />
            <h1 className="title fadeup" style={{ animationDelay: "0.4s" }}>
              Modern,Trending & Creative Portfolio <br />
              <span>React NextJS Template</span>
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animationDelay: "0.8s",
              }}
              className="hero-btn-wrap fadeup"
            >
              <a
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "5px",
                }}
                className="btn btn-1"
                href="#demo"
              >
                <span>view demo</span> <i className="far fa-arrow-down"></i>
              </a>
              <a
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                target="_blank"
                className="btn btn-2 handleHover"
                href="https://themeforest.net/item/bostami-personal-portfolio-react-nextjs-template/50469408?s_rank=1"
              >
                Purchase Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
