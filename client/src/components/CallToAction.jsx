import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-slate-400 mb-2">
          Check out these projects I have completed
        </p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className=" rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://blooming-shoots-education-center.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blooming Shoot School
          </a>
        </Button>
      </div>
      <div className="p-7">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/1*F4gAY4VmxjDHQrn2O9LYyg.png"
          className="sm:w-[400px] sm:h-[100%] rounded-xl"
        />
      </div>
    </div>
  );
};

export default CallToAction;
