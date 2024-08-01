import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore } from '@/config/firebase-config';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

const Gallery = () => {
    const [locationName, setLocationName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchUsername, setSearchUsername] = useState('');
    const [uploads, setUploads] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const router = useRouter();
    const { locationId } = router.query;

    const firestoreTimestampToDate = (timestamp) => {
        return new Date(timestamp.seconds * 1000);
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const time = date.toLocaleTimeString();
        return `${day}/${month}/${year}, ${time}`;
    };

    useEffect(() => {
        const checkLocationExists = async () => {
            if (!locationId) return;
            try {
                const db = getFirestore();
                const locationDocRef = doc(db, 'Locations', locationId);
                const locationDocSnapshot = await getDoc(locationDocRef);
                const locationData = locationDocSnapshot.data();
                if (!locationData || !locationData.location_name || !locationData.is_activated) {
                    router.push('/404');
                } else {
                    setLocationName(locationData.location_name);
                }
            } catch (error) {
                console.error("Error checking location existence:", error);
            }
        };
        checkLocationExists();
    }, [locationId]);

    useEffect(() => {
        const fetchUserUploads = async () => {
            if (!locationId) return;
            try {
                setLoading(true);
                const db = getFirestore();
                const q = query(
                    collection(db, "UserUploads"),
                    where("location_qr_code", "==", doc(db, "Locations", locationId)),
                    where("is_approved", "==", true),
                    orderBy("metadata.capture_date_time", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetchedUploads = querySnapshot.docs.map(doc => doc.data());
                setUploads(fetchedUploads);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user uploads:", error);
                setLoading(false);
            }
        };
        fetchUserUploads();
    }, [locationId]);

    const handleCardClick = (upload) => {
        setSelectedImage(upload);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="px-10 sm:px-20 md:px-24 lg:px-16 xl:px-8 mx-auto max-w-[75rem]">
            <Head>
                <title>Gallery</title>
                <link rel="icon" href="/Avatar-white.svg" />
            </Head>
            <main className="min-h-screen max-w-screen">
                <div className="pt-24 flex flex-col items-center mx-auto">
                    <h2
                        className={
                            "text-center selection:text-black/40 dark:selection:text-white/40 bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent items-center mx-auto text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold"
                        }
                    >
                        {locationName} Gallery
                    </h2>
                    <p className="mt-8 max-w-xl text-center md:w-[70%] mx-auto text-sm md:text-base lg:text-xl mb-2 px-2">
                        Here you will find all the latest photos from this location
                    </p>
                    <div className="mb-8 max-w-xl text-center md:w-[70%] mx-auto">
                        <input
                            type="text"
                            placeholder="Search picture by username"
                            value={searchUsername}
                            onChange={e => setSearchUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="three-body">
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                        </div>
                    </div>
                ) : uploads.length === 0 || !uploads.some(upload => upload.metadata.user_name.toLowerCase().includes(searchUsername.toLowerCase())) ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg">No images available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {uploads
                            .filter(upload => upload.metadata.user_name.toLowerCase().includes(searchUsername.toLowerCase()))
                            .map(upload => (
                                <div
                                    key={upload.url}
                                    className="w-full h-80 p-6 bg-gradient-to-tr dark:from-[#df51ad3e] dark:to-[#eb587d2a] from-[#f6ebeb90] to-[#fff8ec60] flex flex-col mx-auto rounded-3xl shadow-md drop-shadow-2xl backdrop-blur-xl items-center justify-center cursor-pointer"
                                    onClick={() => handleCardClick(upload)}
                                >
                                    <div className="relative w-full h-56">
                                        <Image
                                            src={upload.url}
                                            alt="Uploaded Image"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div className="mt-2 text-center">
                                        <h3 className="text-lg font-semibold bg-gradient-to-br from-blue-400 via-indigo-600 to-red-500 bg-clip-text text-transparent">
                                            {upload.metadata.user_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            {formatDate(firestoreTimestampToDate(upload.metadata.capture_date_time))}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            ❝{upload.metadata.user_note}❞
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </main>
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <button
                        className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
                        onClick={closeModal}
                    >
                        <FaTimes size={24} />
                    </button>
                    <div className="absolute top-4 left-4 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                            {formatDate(firestoreTimestampToDate(selectedImage.metadata.capture_date_time))}
                        </div>
                    <div className="relative w-[80vw] h-[80vh]">
                        <Image
                            src={selectedImage.url}
                            alt="Selected Image"
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg"
                        />
                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
