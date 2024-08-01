import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRef, useEffect, useState } from "react";
import { getFirestore } from '@/config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

import LinkedIn from "../public/icons/linkedin@2x.png";
import GitHub from "../public/icons/github@2x.png";
import Behance from "../public/icons/behance@2x.png";
import Instagram from "../public/icons/instagram@2x.png";
import Gmail from "../public/icons/google@2x.png";
import Twitter from "../public/icons/twitter@2x.png";
import Tiktok from "../public/icons/tiktok@2x.png";

const Experience = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const contactFormRef = useRef(null);

  const handleContactScroll = () => {
    contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mt-32 lg:mt-8 flex flex-col justify-start space-y-12 mx-auto items-center md:mt-20 w-full">
      <div className="drop-shadow-xl flex flex-col space-y-4 mx-6 md:mx-20 lg:mx-0 w-full max-w-4xl rounded-[1.4rem] p-4 rounded-tl-none">
        <div className="mx-auto text-center font-deca font-bold text-2xl dark:text-[#d58357] text-orange-500">
          Partners
        </div>
        <div className="font-normal sm:text-[0.95rem] md:text-base text-center">
          As a newly startup idea of two university students, we haven&apos;t gotten any partners yet but we are open to work with people and our main goal is to expand to many locations and upgrade the stands to be more durable and pleasing. Please <span className="underline cursor-pointer" onClick={handleContactScroll}>contact us</span> if you are interested in partnering with us.
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mb-2">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <ul className="flex items-center justify-center animate-infinite-scroll [&_li]:mx-8 [&_img]:max-w-none">
            <li>
              <Image src={LinkedIn} alt="LinkedIn" width={50} height={50} />
            </li>
            <li>
              <Image src={GitHub} alt="GitHub" width={50} height={50} />
            </li>
            <li>
              <Image src={Behance} alt="Behance" width={50} height={50} />
            </li>
            <li>
              <Image src={Instagram} alt="Instagram" width={50} height={50} />
            </li>
            <li>
              <Image src={Gmail} alt="Gmail" width={50} height={50} />
            </li>
            <li>
              <Image src={Twitter} alt="Twitter" width={50} height={50} />
            </li>
            <li>
              <Image src={Tiktok} alt="Tiktok" width={50} height={50} />
            </li>
          </ul>
          <ul className="flex items-center justify-center animate-infinite-scroll [&_li]:mx-8 [&_img]:max-w-none" aria-hidden="true">
            <li>
              <Image src={LinkedIn} alt="LinkedIn" width={50} height={50} />
            </li>
            <li>
              <Image src={GitHub} alt="GitHub" width={50} height={50} />
            </li>
            <li>
              <Image src={Behance} alt="Behance" width={50} height={50} />
            </li>
            <li>
              <Image src={Instagram} alt="Instagram" width={50} height={50} />
            </li>
            <li>
              <Image src={Gmail} alt="Gmail" width={50} height={50} />
            </li>
            <li>
              <Image src={Twitter} alt="Twitter" width={50} height={50} />
            </li>
            <li>
              <Image src={Tiktok} alt="Tiktok" width={50} height={50} />
            </li>
          </ul>
        </div>
      </div>
      <div ref={contactFormRef}>
      </div>
    </div>
  );
};

export default Experience;
