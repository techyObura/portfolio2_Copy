import React from "react";

const About = ({ menu }) => {
  return (
    <div
      className={` min-h-[100vh]   relative ${
        menu ? "top-[46vw] sm:top-20" : "top-20"
      }`}
    >
      <div className=" h-full w-full px-3">
        <div className="h-full flex flex-col sm:flex-row">
          {/* Left || Top */}
          <div className=" flex-1 box flex justify-center items-center">
            <div className="w-72 h-72 sm:w-[400px] sm:h-[400px] rounded-full relative bg-teal-500 dark:bg-orange-500">
              <div className="w-72 h-72 sm:w-[400px] sm:h-[400px] z-20 absolute top-4 right-4  rounded-full dark:bg-white bg-slate-300">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mungaieve-58b3d.appspot.com/o/1715619471708alfred1.png?alt=media&token=103e4bdd-1174-4a1a-873b-0be2c85e92b1"
                  className="w-full h-full object-cover object-top rounded-full"
                  alt=""
                />
              </div>
            </div>
          </div>
          {/* Right || Bottom */}
          <div className="flex-1 relative flex justify-center items-center mt-7 sm:mt-0 h-[80vh] ">
            <div className="w-full ">
              <div className="">
                <h2 className="text-4xl text-center font-semibold">
                  About Alfred Ochieng
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                <div className="self-center text-center mt-10">
                  <h3>
                    First of all I thank Almighty God for everything He has
                    enabled in my life.
                  </h3>
                  <p>
                    It is a dream come true that I am a skilled and experienced
                    software Engineer. I do not practice software engineering as
                    a course, or profession for money but as a hobby, something
                    I am passionate about and I love doing.
                  </p>
                </div>

                <div className="text-center ">
                  <p>
                    I am passionate about artificial intelligence I understand
                    that it is here to stay and we must cope with it! I am
                    currently working on life changing solutions applying
                    scalability, security, artificial intelligence and
                    generative AI skills.
                  </p>
                </div>
                <div>
                  <p className="text-center uppercase mt-4">
                    for any assistance contact me:
                  </p>
                  <p className="text-center mt-1">
                    <span className="text-slate-400">
                      alfredochieng20166@gmail.com
                    </span>{" "}
                    <br />
                    or <br />
                    <span className="text-slate-400">+25472 341 4937</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
