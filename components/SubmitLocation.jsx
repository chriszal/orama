import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import emailjs from '@emailjs/browser';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomAlert from '@/components/CustomAlert';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX;

const SubmitLocation = () => {
  const mapContainerRef = useRef(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const mapRef = useRef();
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [23.8, 38],
      zoom: 5,
    });

    mapRef.current = map;

    const handleMapClick = (event) => {
      const lat = event.lngLat.lat;
      const lng = event.lngLat.lng;

      if (isPointInGreece(lng, lat)) {
        setLocation({ latitude: lat, longitude: lng });

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markerRef.current = newMarker;
      } else {
        showAlert('Only locations in Greece allowed!', 'error');
      }
    };

    map.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.remove();
      }
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const google_maps_link = `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`;
    const templateParams = {
      user_name,
      user_email,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      google_maps_link,
    };

    emailjs.send(
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_ID,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_TEMPLATE_SUBMIT,
      templateParams,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_PUBLIC_KEY
    )
      .then((response) => {
        setLoading(false);
        if (response.text === "OK") {
          showAlert('Email sent successfully!', 'success');
          setName('');
          setEmail('');
          setDescription('');
          setLocation({ latitude: null, longitude: null });
          if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
          }
        } else {
          showAlert('Email failed to send', 'error');
        }
      })
      .catch((err) => {
        console.error('Failed to send email:', err);
        setLoading(false);
        showAlert('Email failed to send', 'error');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Choose Location on Map</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Click on the map to pin the location where you want the new site to be added.
          </p>
          <div ref={mapContainerRef} className="w-full h-64 rounded-lg shadow-md mb-4"></div>
          {(!location.latitude || !location.longitude) && (
            <p className="text-red-500">Please select a location on the map before submitting.</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Submit Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={user_name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={user_email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg shadow-sm ${loading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'} focus:outline-none focus:ring focus:border-blue-300`}
                disabled={!location.latitude || !location.longitude || loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {alert.message && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />}
    </div>
  );
};

export const isPointInGreece = (longitude, latitude) => {
  const GREECE_BOUNDS = {
    WEST: 19.3,
    EAST: 29.7,
    NORTH: 42,
    SOUTH: 34.8,
  };
  return (
    longitude >= GREECE_BOUNDS.WEST &&
    longitude <= GREECE_BOUNDS.EAST &&
    latitude >= GREECE_BOUNDS.SOUTH &&
    latitude <= GREECE_BOUNDS.NORTH
  );
};

export default SubmitLocation;
