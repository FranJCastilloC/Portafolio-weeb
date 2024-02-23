import { homepages } from "@/data/homepages";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Demo() {
  return (
    <div className="home-demo-area bg-black " id="demo">
      <div className="container">
        <div className="section-title-wrap text-center mb-70">
          <h1 className="main-title">home demo</h1>
          <Image
            width={372}
            height={68}
            className="bg-shape"
            src="/assets/img/preview.png"
            alt="shape"
          />
          <h2 className="section-title">03 Awesome Light & Dark Demo</h2>
          <p className="section-pera">
            Bostami build with Modern, Elegant & Beautiful trendng
            <br /> technology like React Nextjs template.
          </p>
        </div>

        <div className="row">
          {homepages.map((elm, i) => (
            <div key={i} className="col-lg-4 col-md-6 col-sm-6">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="demo-link"
                href={elm.href}
              >
                <span>
                  <Image width={520} height={540} src={elm.imgSrc} alt="demo" />
                </span>
                <span className="demo-title">{elm.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
