"use client";
import Image from "next/image";
import React, { useEffect } from "react";

export default function Modal({ modalContent, setModalContent }) {
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const modalDialog = document.querySelector(".modal");
      const modalContent = document.querySelector(".modal-content");

      // Check if the click is outside of modal-content but inside modal-dialog
      if (
        modalDialog &&
        modalContent &&
        !modalContent.contains(event.target) &&
        modalDialog.contains(event.target)
      ) {
        // Your logic for handling the click outside modal-content
        setModalContent();
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <div
      className={`modal h1-modal-box fade ${modalContent ? "show" : ""} `}
      id="h1-blog-1"
      tabIndex="-1"
      role="dialog"
      style={{
        transition: "0.4s",
        display: `${modalContent ? "block" : "block"}`,
        visibility: `${modalContent ? "visible" : "hidden"}`,
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              onClick={() => setModalContent()}
            >
              <i className="far fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="h1-modal-img">
              {modalContent?.imgSrc && (
                <Image
                  width={800}
                  height={800}
                  src={modalContent?.imgSrc}
                  style={{
                    width: "100%",
                    height: "fit-content",
                    maxHeight: "450px",
                    objectFit: "cover",
                  }}
                  alt="Certificates"
                />
              )}
            </div>

            <div className="blog-meta">
              <span className="blog-date">{modalContent?.date}</span>
              <span className="blog-cetagory">{modalContent?.category}</span>
              <div className="col-md-6">
                  <h3 className="portfolio-modal-table-text">
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.5em' }}></i>
                    <span style={{ fontSize: '0.5em' }}>Preview :</span>{" "}
                    <a href={modalContent?.previewLink} style={{ fontSize: '0.5em' }}>
                      {modalContent?.previewName}
                    </a>
                  </h3>
                </div>
            </div>
            

            <h6 className="blog-title">{modalContent?.title}</h6>

            <div className="h1-modal-paragraph">
              {modalContent?.desc.map((elm, i) => (
                <p key={i}>{elm}</p>
              ))}
            </div>

            <div className="h1-modal-comment-item">

              
              
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}
