import AboutTwo from "@/components/homes/about/AboutTwo";
import HeaderTwo from "@/components/homes/headers/HeaderTwo";
import PersonalInfoTwo from "@/components/homes/personalInfo/PersonalInfoTwo";
import React from "react";
export const metadata = {
  title: "About || Bostami - Professional portfolio NextJS Template",
  description:
    "Discover Botami,the most impressive portfolio template for work showcase, blog",
};
export default function page() {
  return (
    <>
      <div className="page-wrapper page-wrapper-2">
        <HeaderTwo />
        <div className="bostami-page-area z-index-3">
          <div className="container">
            <AboutTwo />
          </div>
        </div>
      </div>
    </>
  );
}
