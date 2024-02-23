import { education } from "@/data/education";
import Image from "next/image";
import React from "react";

export default function Education() {
  return (
    <div className="col-xl-6 col-lg-7">
      <div className="bostami-section-title-wrap mb-20">
        <h4 className="section-title">
          <Image
            width={38}
            height={23}
            src="/assets/img/icon/edu-icon.png"
            alt="icon"
          />
          Education
        </h4>
      </div>

      <div className="bostami-card-wrap">
        {education.map((elm, i) => (
          <div
            className={`bostami-card-item ${elm.bgClass} ${
              i + 1 != education.length && "mb-20"
            } `}
          >
            <span className="card-subtitle">{elm.session}</span>
            <h6 className="card-title">
              {elm.cardTitle} <span>- {elm.cardSubtitleSecondary},</span>
            </h6>
            <p className="card-text">{elm.locatopn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
