import { useEffect, useState } from "react";
import Link from "next/link";
import { FiGitBranch } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import LinkedIn from "../public/icons/linkedin@2x.png";
import GitHub from "../public/icons/github@2x.png";
import Behance from "../public/icons/behance@2x.png";
import Instagram from "../public/icons/instagram@2x.png";
import Gmail from "../public/icons/google@2x.png";
import Twitter from "../public/icons/twitter@2x.png";
import Tiktok from "../public/icons/tiktok@2x.png"
import Image from "next/image";
import Star from "@/public/Star.svg";

const Footer = () => {
 

  return (
    <div className=" flex select-none text-sm  py-16 mt-16 flex-col h-max items-center mx-auto justify-center">
      <div className="flex justify-center space-x-4 md:space-x-6 dark:text-white/70 text-gray-500 text-[0.6rem] sm:text-xs md:text-sm lg:text-md mt-2">
      <Link
          href="https://www.tiktok.com/@orama_initiative"
          target="blank"
          className=" dark:hover:text-purple-400 hover:text-purple-600 font-semibold"
        >
          {" "}
          {/* GitHub{" "} */}
          <Image src={Tiktok} alt="tiktok" width="30" />
        </Link>
        <Link
          href="https://www.instagram.com/orama_initiative"
          target="blank"
          className=" dark:hover:text-purple-400 hover:text-purple-600 font-semibold"
        >
          {" "}
          {/* LinkedIn{" "} */}
          <Image src={Instagram} alt="instagram" width="30" />
        </Link>
       
        
        <Link
          href="https://x.com/OramaInitiative"
          target="blank"
          className=" dark:hover:text-purple-400 hover:text-purple-600 font-semibold"
        >
          {" "}
          {/* GitHub{" "} */}
          <Image src={Twitter} alt="twitter" width="30" />
        </Link>
      </div>
      
    </div>
  );
};

export default Footer;
