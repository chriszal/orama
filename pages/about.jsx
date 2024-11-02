import { useEffect } from "react";

import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";

import CategoryCard from "@/components/CategoryCard";

import Flash from "@/public/Flash.svg";
import HeroBlack from "@/public/hero-black.png";
import HeroWhite from "@/public/hero-white.png";
import Rocket from "@/public/Rocket.svg";
import Globe from "@/public/Globe.svg";
import Megaphone from "@/public/Megaphone.svg";
import Mobile from "@/public/Mobile.svg";
import Palette from "@/public/Palette.svg";
import Sparkles from "@/public/Sparkles.svg";
import love_black from "@/public/love-black.svg";
import love_white from "@/public/love-white.svg";

export default function About() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="px-6 sm:px-10 md:px-16 lg:mb-12 lg:px-32 mx-auto max-w-[75rem]">
      <Head>
        <title>About</title>
        <link rel="icon" href="/Avatar-white.svg" />
      </Head>
      <main className="min-h-screen max-w-screen">
        <div className="mx-auto pt-10 pb-10 max-w-7xl">
          <div className="text-center mx-auto flex flex-col">
            <h1
              className={`mt-6 mb-8 bg-gradient-to-br to-blue-500 via-red-400/90 from-yellow-500 bg-clip-text text-transparent selection:text-gray-700 dark:selection:text-white/90 text-3xl sm:text-4xl lg:text-5xl font-semibold`}
            >
              About
            </h1>
          </div>
          <div className="text-[0.92rem] text-base mx-auto sm:mx-6 md:mx-12 lg:mx-16 font-light dark:text-white text-gray-900 leading-relaxed">
            <p className="mt-4 mb-8 font-normal">
              Orama is a project developed by two Greek University students that aims to create a collection of images showing the changes in different locations.
            </p>
            <p className="mt-4 mb-8 font-normal">How does it work?</p>
            <p className="mt-4 mb-8 font-normal">
              Simply scan the QR code on one of our phone stands, take a photo, and share your perspective with the world...
            </p>
            <p className="mt-4 mb-8 font-normal">
              Together, we can combine our unique perspectives of the world&#39;s most beautiful locations and create a dynamic overview. Whether it&#39;s a beach, a city, a forest, or any other location, we want to capture its beauty, traffic, and changes through the eyes of the community.
            </p>
            <p className="mt-4 mb-8 font-normal">
              Uniquely similar or Similarly unique? Your call!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
