import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Experience from "@/components/sections/Experience";
import Awards from "@/components/sections/Awards";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Reading from "@/components/sections/Reading";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Awards />
        <Projects />
        <Certificates />
        <Reading />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
