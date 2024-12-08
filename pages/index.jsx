import { useEffect } from "react";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";

import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import HeroSection from "@/components/HeroSection";
import Leaderboard from "@/components/Leaderboard"; 


export default function Home() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  
  return (
    <>
      <Head>
        <title>Orama Initiative</title>
        <link rel="icon" href="/Avatar-white.svg" />
      </Head>
      <div className="lg:min-h-screen px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mx-auto max-w-screen-xl">
      <HeroSection />
      <div className="mt-20 mx-auto">
          <Leaderboard />
        </div>

        <div className="mt-28 mx-auto">
          <Experience />
        </div>
        <div className="mt-28 mx-auto ">
          <Contact />
        </div>
      </div>
    </>
  );
}
