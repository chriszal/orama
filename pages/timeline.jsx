import TimeLine from "@/components/TimeLine";
import Head from "next/head";
import React from "react";

const Timeline = () => {
  return (
    <div className="px-10 sm:px-20 md:px-32 md:-mb-52 lg:mb-0 lg:px-60 mx-auto max-w-[75rem]">
      <Head>
        <title>Timeline </title>
        <link rel="icon" href="/Avatar-white.svg" />
      </Head>
      <main className="min-h-screen max-w-screen">
        <div className="pt-24 flex flex-col items-cen mx-auto">
          <h2
            className={
              "selection:text-black/40 dark:selection:text-white/40 bg-gradient-to-r from-teal-200 to-lime-200 bg-clip-text text-transparent items-center mx-auto text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
            }
          >
            Timeline
          </h2>
          <p className="mt-8 max-w-xl text-center md:w-[70%] mx-auto text-sm md:text-base lg:text-xl mb-2 px-2">
            The linear view of milestones and locations added
            so far.
          </p>
         
          <div className="mt-10 md:ml-12 lg:ml-12 mb-2">
            <TimeLine />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Timeline;
