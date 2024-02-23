import { contactData } from "@/data/contactData";
import { profileInfo } from "@/data/profileInfo";
import { socialMediaData } from "@/data/socials";
import Image from "next/image";
import React from "react";

export default function PersonalInfoThree() {
  return (
    <div className="col-xxl-4 col-xl-4 col-lg-4">
      <div className="bostami-parsonal-info-area">
        <div className="bostami-parsonal-info-wrap">
          <div className="bostami-parsonal-info-img">
            <Image
              width={240}
              height={240}
              src={profileInfo.imageSrcTwo}
              alt="author"
            />
          </div>

          <h4 className="bostami-parsonal-info-name">
            <a href="#">{profileInfo.name}</a>
          </h4>
          <span className="bostami-parsonal-info-bio mb-15">{profileInfo.title}</span>

          <ul className="bostami-parsonal-info-social-link mb-30">
            {socialMediaData.map((elm, i) => (
              <li key={i}>
                <a style={{ color: elm.color }} href={elm.href}>
                  <i className={elm.className}></i>
                </a>
              </li>
            ))}
          </ul>

          <div className="bostami-parsonal-info-contact mb-30">
            {contactData.map((elm, i) => (
              <div key={i} className="bostami-parsonal-info-contact-item">
                <div
                  style={{ color: `${elm.color}`, fontSize: `${elm.fontSize}` }}
                  className="icon"
                >
                  <i className={elm.iconClass}></i>
                </div>
                <div className="text">
                  <span>{elm.text.label}</span>
                  <p>{elm.text.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bostami-parsonal-info-btn">
            <a className="btn-2" href="/cv.pdf" download>
              <span style={{ color: "#fff" }} className="icon">
                <i className="fa-regular fa-download"></i>
              </span>
              download cv
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
