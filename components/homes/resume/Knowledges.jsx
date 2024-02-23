import { knoledges } from "@/data/knoledges";
import React from "react";

export default function Knowledges() {
  return (
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
  );
}
