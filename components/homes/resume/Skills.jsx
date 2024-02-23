import { skillData } from "@/data/skills";
import React from "react";

export default function Skills() {
  return (
    <div className="col-xl-6 col-lg-7">
      <div className="bostami-section-title-wrap mb-20">
        <h4 className="section-title">Working Skills</h4>
      </div>

      <div className="skill-bar-wrap">
        {skillData.map((elm, i) => (
          <div
            key={i}
            className={`skill-bar-item ${i + 1 != skillData.length && "mb-30"} `}
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
  );
}
