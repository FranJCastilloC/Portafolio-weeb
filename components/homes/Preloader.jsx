"use client";
import React, { useState, useEffect } from "react";

export default function Preloader() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaded, setPreloaded] = useState(false);
  useEffect(() => {

    setPreloaded(true);
    document.getElementsByClassName('page-wrapper')[0].classList.add('fadeingpre')
    

    setTimeout(() => {
      setShowPreloader(false);
      setPreloaded(false);
      

      setTimeout(() => {
        document.getElementsByClassName('page-wrapper')[0].classList.remove('fadeingpre')
        
      }, 700);
   
      
   
    }, 1000);
    return () => {
      
      
    }
  }, []);
 
  

  return (
    <>
      {showPreloader && (
        <div id="preloader" className={preloaded ? "preloaded" : ""}>
          <div className="loader_line"></div>
        </div>
      )}
    </>
  );
}
