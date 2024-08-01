import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFirestore } from '@/config/firebase-config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const LocationCard = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const db = getFirestore();
        const locationsRef = collection(db, 'Locations');
        const q = query(locationsRef, where("is_activated", "==", true));
        console.log("Fetching locations...");

        const querySnapshot = await getDocs(q);
        console.log("Locations fetched:", querySnapshot.size);

        const locationsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const locationData = doc.data();
            console.log(`Fetching images for location: ${locationData.location_name}`);

            const userUploadsRef = collection(db, 'UserUploads');
            const uploadsQuery = query(
              userUploadsRef,
              where("location_qr_code", "==", doc.ref),
              where("is_approved", "==", true),
              orderBy("metadata.capture_date_time", "desc"),
              limit(1)
            );
            const uploadsSnapshot = await getDocs(uploadsQuery);

            const latestImage = uploadsSnapshot.docs[0]?.data()?.url || '/work/comingsoon.png';
            console.log(`Latest image for ${locationData.location_name}:`, latestImage);

            return {
              id: doc.id,
              name: locationData.location_name,
              date: locationData.location_date?.seconds ? locationData.location_date.toDate() : null,
              image: latestImage,
            };
          })
        );

        setLocations(locationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
       
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div className="rounded-lg mb-12 flex flex-col items-center" key={location.id}>
            <Link href={`/locations/${location.id}/gallery`} passHref>
              <Image
                loading="lazy"
                src={location.image}
                alt={location.name}
                width="200"
                height="150"
                className="rounded-lg drop-shadow-2xl hover:scale-110 cursor-pointer"
              />
            </Link>
            <div className="flex flex-col items-center mt-3">
              <h1 className="font-semibold text-[1.5rem] text-gray-700 dark:text-white">
                {location.name}
              </h1>
              <p className="text-gray-400 font-light text-center text-sm">
                Created at: {location.date ? location.date.toLocaleDateString() : "No date available"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="py-4 px-2 text-center ">
        <p className="text-sm md:text-base lg:text-xl">
          If you have any location ideas that you would love to be added to our movement, please{" "}
          <Link href="/submit-location">
            <span className="text-blue-500 underline">submit it here.</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LocationCard;
