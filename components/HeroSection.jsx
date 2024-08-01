import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BsArrowUpRight } from "react-icons/bs";
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";
import { getFirestore } from '@/config/firebase-config'
import { collection, query, where, getDocs } from 'firebase/firestore';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX;

const HeroSection = () => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();
            const locationsRef = collection(db, 'Locations');
            const q = query(locationsRef, where("is_activated", "==", true));
            const querySnapshot = await getDocs(q);

            const locationsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLocations(locationsData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (mapContainerRef.current && !map) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [23.8, 38],
                zoom: 5,
            });

            mapInstance.on('load', () => {
                setMap(mapInstance);
            });
        }

        return () => map && map.remove();
    }, [mapContainerRef, map]);

    useEffect(() => {
        if (map && locations.length > 0) {
            locations.forEach((location) => {
                const el = document.createElement('div');
                el.className = 'map-pin';
                const img = document.createElement('img');
                img.src = '/pin.svg';
                img.alt = 'Map Pin';
                img.style.width = '20px';
                img.style.height = '20px';
                el.appendChild(img);

                const coordinates = [location.location.longitude, location.location.latitude];

                new mapboxgl.Marker(el)
                    .setLngLat(coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3>${location.location_name}</h3>
              <div>
                <button 
                  onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}', '_blank')" 
                  style="background-color: #4285F4; color: white; border: none; padding: 10px 15px; margin-right: 10px; cursor: pointer; border-radius: 10px; display: inline-block;">
                  <img src="/assets/google-maps.png" alt="Google Maps Icon" style="width: 16px; vertical-align: middle; margin-right: 5px;" /> 
                  Directions
                </button>
                <button 
                  onclick="window.location.href='/locations/${location.id}/gallery'" 
                  style="background-color: #10B981; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 10px; display: inline-block;">
                  See More
                </button>
              </div>
            `))
                    .addTo(map);
            });
        }
    }, [map, locations]);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between mt-12 lg:mt-20 w-full">
            <div className="flex flex-col space-y-6 lg:w-1/2">
                <h2 className="text-xl font-semibold text-blue-500">#orama✖initiative</h2>
                <h1 className="text-4xl lg:text-6xl font-bold">Discover the world through time</h1>
                <p className="text-lg lg:text-xl">Explore the beauty and history of our world, one location at a time.</p>
                <div className="flex space-x-4">
                    <Link href="/locations">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Locations</button>
                    </Link>
                    <Link href="/about">
                        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md">Read About Us</button>
                    </Link>
                </div>
            </div>
            <div className="w-full lg:w-1/2 h-96 mt-8 lg:mt-0">
                <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-md"></div>
            </div>
        </div>
    );
};

export default HeroSection;