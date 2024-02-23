import { experiences } from "@/data/experience";
import Image from "next/image";
import React from "react";

export default function Experience() {
  return (
    <div className="col-xl-6 col-lg-5">
      <div className="bostami-section-title-wrap mb-20">
        <h4 className="section-title">
          <Image
            width={30}
            height={27}
            src="/assets/img/icon/exper-icon.png"
            alt="experience"
          />
          experience
        </h4>
      </div>

      {experiences.map((elm, i) => (
        <div
          key={i}
          className={`bostami-card-item ${elm.bgClass} ${
            i + 1 != experiences.length && "mb-20"
          } `}
        >
          <span className="card-subtitle">{elm.session}</span>
          <h6 className="card-title">{elm.role}</h6>
          <p className="card-text">{elm.company}</p>
        </div>
      ))}
    </div>
  );
}
