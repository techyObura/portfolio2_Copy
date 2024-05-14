import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";

const FooterComp = ({ menu }) => {
  return (
    <Footer
      container
      className={`border-t-8 border-teal-500  relative ${
        menu ? "top-[55vw] md:top-32 lg:top-24" : "top-24 md:top-32 lg:top-24"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex md:flex-row flex-col md:justify-between items-center gap-7">
          {/* Logo */}
          <div className="">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-2xl md:text-4xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
                Alfred Ochieng
              </span>{" "}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:mt-4 md:gap-6">
            <div
              className="
            "
            >
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Capabilities
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Alfred Ochieng
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div
              className="
            "
            >
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/software-developer-alfred-ochieng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link
                  href="https://www.facebook.com/software.engineer.87426?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Footer.Link>
                <Footer.Link
                  href="https://discord.com/channels/@me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div
              className="
            "
            >
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="/" target="_blank" rel="noopener noreferrer">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="text-xl w-full flex flex-col items-center md:flex-row md:items-center md:justify-between">
          <Footer.Copyright
            href="#"
            by="Developed by Alfred Ochieng"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-4">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsFacebook} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
