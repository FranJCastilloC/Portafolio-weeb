
import Image from "next/image";
import { contactItems } from "@/data/contact";
import ContactForm from "./ContactForm";


export default function ContactTwo() {
  

  return (
    <div className="bostami-page-area z-index-3">
      <div className="container">
        <div className="bostami-page-wrap pt-60 pl-80 pr-80">
          <div className="page-tilte-2-wrap">
            <div className="row">
              <div className="col-12">
                <div className="bostami-page-title-wrap mb-40">
                  <h2 className="page-title">contact</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="bostami-contact-2-wrap">
            <div className="row">
              <div className="col-xl-4 col-lg-12">
                <div className="bostami-contact-2-item-wrap mb-60">
                  <div className="row">
                    {contactItems.map((elm, i) => (
                      <div key={i} className="col-xl-12 col-lg-6">
                        <div
                          className={`bostami-contact-item  ${elm.bgColor} bg-prink mb-30`}
                        >
                          <div className="icon">
                            <Image
                              width={40}
                              height={40}
                              src={elm.iconSrc}
                              alt="contact"
                            />
                          </div>
                          <div className="text">
                            <h5 className="title">{elm.title} :</h5>
                            {elm.content.map((elm2, i2) => (
                              <span key={i2}>{elm2}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-xl-8  col-lg-12">
                <div className="contact-area bg-light-white-2 mb-60">
                  <h5 className="contact-title">
                    I'm always open to discussing produuct
                  </h5>
                  <h5 className="contact-title-b">design work or partnerships.</h5>
                  <ContactForm/>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-copyright text-center pt-25 pb-25 bg-light-white-2 border-redius-20">
            <span>
              © {new Date().getFullYear()} All Rights Reserved by ib-themes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
