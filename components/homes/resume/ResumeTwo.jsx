import { awards } from "@/data/awards";
import { education } from "@/data/education";
import { experiences } from "@/data/experience";
import { knoledges } from "@/data/knoledges";
import { skillData } from "@/data/skills";
import Image from "next/image";
import React from "react";

export default function ResumeTwo() {
  return (
    <div className="bostami-page-area z-index-3">
      <div className="container">
        <div className="bostami-page-wrap pt-60 pl-80 pr-80">
          <div className="page-tilte-2-wrap">
            <div className="row">
              <div className="col-12">
                <div className="bostami-page-title-wrap mb-40">
                  <h2 className="page-title">Resume</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="bostami-resume-2">
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="bostami-section-title-wrap mb-20">
                  <h4 className="section-title">
                    <Image
                      width={38}
                      height={23}
                      src="/assets/img/icon/edu-icon-2.png"
                      alt="education"
                    />
                    Education
                  </h4>
                </div>

                <div className="bostami-card-wrap mb-50">
                  {education.map((elm, i) => (
                    <div
                      className={`bostami-card-item ${elm.bgClass} ${
                        i + 1 != education.length && "mb-20"
                      } `}
                    >
                      <span className="card-subtitle">{elm.session}</span>
                      <h6 className="card-title">
                        {elm.cardTitle}{" "}
                        <span>- {elm.cardSubtitleSecondary},</span>
                      </h6>
                      <p className="card-text">{elm.locatopn}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="bostami-section-title-wrap mb-20">
                  <h4 className="section-title">
                    <Image
                      width={30}
                      height={27}
                      src="/assets/img/icon/exper-icon-2.png"
                      alt="experience"
                    />
                    experience
                  </h4>
                </div>

                <div className="bostami-card-wrap mb-50">
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
              </div>

              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="bostami-section-title-wrap mb-20">
                  <h4 className="section-title">
                    <Image
                      width={24}
                      height={31}
                      src="/assets/img/icon//Awards-icon.png"
                      alt="awards"
                    />{" "}
                    Awards
                  </h4>
                </div>

                <div className="bostami-card-wrap mb-50">
                  {awards.map((elm, i) => (
                    <div
                      key={i}
                      className={`bostami-card-item ${elm.bgClass} ${
                        i + 1 != awards.length ? "mb-20" : ""
                      } `}
                    >
                      <span className="card-subtitle">{elm.year}</span>
                      <h6 className="card-title">{elm.role}</h6>
                      <p className="card-text">{elm.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="section-wrapper border-redius-20 bg-light-white-2 mt-20  pt-70 pb-60 pl-30 pr-30">
            <div className="row">
              <div className="col-xl-6 col-lg-7">
                <div className="bostami-section-title-wrap mb-20">
                  <h4 className="section-title">Working Skills</h4>
                </div>

                <div className="skill-bar-wrap">
                  {skillData.map((elm, i) => (
                    <div
                      key={i}
                      className={`skill-bar-item ${
                        i + 1 != skillData.length && "mb-30"
                      } `}
                    >
                      <div className="title-wrap">
                        <h5 className="title">{elm.title}</h5>
                        <span className="count">{elm.progress}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div
                          className={`progress-line ${elm.progressClass}`}
                          style={{ width: `${elm.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-xl-6 col-lg-5">
                <div className="bostami-section-title-wrap mb-20">
                  <h4 className="section-title">Knowledges</h4>
                </div>

                <div className="knowledeges-item-wrap">
                  {knoledges.map((elm, i) => (
                    <span key={i} className="gk-item">
                      {elm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="footer-copyright text-center pt-25 pb-25">
            <span>
              © {new Date().getFullYear()} All Rights Reserved by ib-themes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
