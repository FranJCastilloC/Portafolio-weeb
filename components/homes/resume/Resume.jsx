import React from "react";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Knowledges from "./Knowledges";

export default function Resume() {
  return (
    <div className="col-xxl-8 col-xl-9">
      <div className="bostami-page-content-wrap">
        <div className="section-wrapper pl-60 pr-60 pt-60">
          <div className="bostami-page-title-wrap mb-15">
            <h2 className="page-title">resume</h2>
          </div>
        </div>

        <div className="section-wrapper pl-60 pr-60 mb-60">
          <div className="row">
            <Education />

            <Experience />
          </div>
        </div>

        <div className="section-wrapper bg-light-white-2 pt-70 pb-60 pl-60 pr-60">
          <div className="row">
            <Skills />

            <Knowledges />
          </div>
        </div>

        <div className="footer-copyright text-center pt-25 pb-25">
          <span>
            © {new Date().getFullYear()} All Rights Reserved by ib-themes.
          </span>
        </div>
      </div>
    </div>
  );
}
