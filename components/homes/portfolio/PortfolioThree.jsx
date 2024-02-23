"use client";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { filterButtons, portfolioData } from "@/data/portfolioData";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Image from "next/image";

export default function PortfolioThree() {
  const [filteredItem, setFilteredItem] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [modalContent, setModalContent] = useState();
  useEffect(() => {
    if (activeTab == "All") {
      setFilteredItem(portfolioData);
    } else {
      const filtered = portfolioData.filter((elm) =>
        elm.category.includes(activeTab),
      );
      setFilteredItem(filtered);
    }
  }, [activeTab]);
  return (
    <>
      <div className="bostami-page-content-wrap">
        <div className="section-wrapper pl-60 pr-60 pt-60">
          <div className="bostami-page-title-wrap mb-15">
            <h2 className="page-title">Projects</h2>
          </div>
        </div>

        <div className="section-wrapper pr-60 pl-60 mb-60">
          <div className="row">
            <div className="col-12">
              <ul className="fillter-btn-wrap buttonGroup isotop-menu-wrapper mb-30">
                {filterButtons.map((elm, i) => (
                  <li
                    onClick={() => setActiveTab(elm.text)}
                    key={i}
                    className={`fillter-btn ${
                      activeTab == elm.text ? "is-checked" : ""
                    } `}
                  >
                    {elm.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-12">
              <div
                id="fillter-item-active"
      
                className="fillter-item-wrap "
              >
                <AnimatePresence>
                <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 850: 2, 1100: 3,1200:2}}
            >
              <Masonry>
                  {filteredItem.map((elm, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 , scale:0 }}
                        animate={{ opacity: 1 , scale : 1 }}
                        exit={{ opacity: 0 , scale:0.5 }}
                      transition={{ duration: 0.3 }}
                      key={elm.id}
                      className={elm.class}
                      style={{width:'100%'}}
                    >
                      <div style={{width:'100%'}} className={`fillter-item ${elm.bgClass}`}>
                        <a className="img" href="#" data-bs-toggle="modal">
                          <Image
                            width={310}
                            style={{ width: "100%", height: "fit-content" }}
                            height={310}
                            src={elm.imgSrc}
                            alt="portfolio"
                            onClick={() => setModalContent(elm)}
                          />
                        </a>
                        <span className="item-subtitle">{elm.subtitle}</span>
                        <h6
                          className="item-title"
                          onClick={() => setModalContent(elm)}
                        >
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#portfolio-1"
                          >
                            {elm.title}
                          </a>
                        </h6>
                      </div>
                    </motion.div>
                  ))}
                   </Masonry>
                  </ResponsiveMasonry>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright text-center bg-light-white-2 pt-25 pb-25">
          <span>
            © {new Date().getFullYear()} All Rights Reserved by ib-themes.
          </span>
        </div>
      </div>
      <Modal modalContent={modalContent} setModalContent={setModalContent} />
    </>
  );
}
