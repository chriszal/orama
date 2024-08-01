import { useEffect } from "react";

import Head from "next/head";
import Link from "next/link";

import LocationCard from "@/components/LocationCard";

export default function Locations() {
  return (
    <div className="px-10 sm:px-20 md:px-32 md:-mb-52 lg:mb-0 lg:px-60 mx-auto max-w-[75rem]">
      <Head>
        <title>Locations </title>
        <link rel="icon" href="/Avatar-white.svg" />
      </Head>
      <main className="min-h-screen max-w-screen">
        <div className="pt-24 flex flex-col items-cen mx-auto">
          <h2
            className={
              "selection:text-black/40 dark:selection:text-white/40 bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent items-center mx-auto text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
            }
          >
            Explore the Locations
          </h2>
          <p className="mt-8 max-w-xl text-center md:w-[70%] mx-auto text-sm md:text-base lg:text-xl mb-2 px-2">
            Find our collection of locations and click on any of them to see more. Send us your own favorite spots to be added to the project.
          </p>
          
        </div>
        <div className="mt-20 mb-10">
          <LocationCard />
         
        </div>

           
      </main>
    </div>
  );
}
