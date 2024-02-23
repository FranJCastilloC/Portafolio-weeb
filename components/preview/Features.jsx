import { featureItems } from "@/data/features";
import Image from "next/image";
import React from "react";

export default function Features() {
  return (
    <div className="home-demo-area bg-gray">
      <div className="container">
        <div className="section-title-wrap text-center mb-60">
          <h1 className="main-title">Salient Features</h1>
          <Image
            width={372}
            height={68}
            className="bg-shape"
            src="/assets/img/preview.png"
            alt="shape"
          />
        </div>

        <div className="row">
          {featureItems.map((elm, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="feature-item">
                <div className="feature-icon">
                  <Image width={48} height={48} src={elm.imgSrc} alt="features" />
                </div>
                <h3 className="feature-title">{elm.title}</h3>
                <p className="feature-text">{elm.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
