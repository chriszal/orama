import Head from 'next/head';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, getStorage } from '@/config/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, serverTimestamp, doc , query, where, getDocs, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { getAthensTimeISOString } from '@/utils/get-athens-time';
import InstructionsDialog from '@/components/InstructionsDialog';
import SuccessDialogComponent from '@/components/SuccessDialogComponent';
import CustomAlert from '@/components/CustomAlert';
import Dialog from '@/components/Dialog';
import CustomDialog from '@/components/CustomDialog';

import { FaCamera, FaInfoCircle } from 'react-icons/fa';

const db = getFirestore();

const LocationUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alert, setAlert] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [customDialog, setCustomDialog] = useState(null);
  const router = useRouter();
  const { locationId } = router.query;
  const showDialog = (title, content, actions) => {
    setDialog({ title, content, actions });
  };
  const showCustomDialog = (title, content, actions) => {
    setCustomDialog({ title, content, actions });
  };

  useEffect(() => {
    showCustomDialog('', '', <InstructionsDialog onClose={closeCustomDialog} locationId={locationId}/>)
    const checkLocationExists = async () => {
      try {
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

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };


  const closeDialog = () => {
    setDialog(null);
  };

  const closeCustomDialog = () => {
    setCustomDialog(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const confirmUpload = () => {
    if (!imageSrc) {
      showAlert('Please take photo first!', 'error');
      return;
    }

    showDialog(
      'Are you sure?',
      'Do you want to upload this photo?',
      <>
        <button onClick={closeDialog} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Upload</button>
      </>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeDialog();
    setIsLoading(true);

    try {
      if (!imageSrc) {
        showAlert('Please take photo first!', 'error');
        return;
      }

      const storage = getStorage();
      const fileName = getAthensTimeISOString();
      const storageRef = ref(storage, `${locationName}/${fileName}`);

      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image: ", error);
          setUploadProgress(0);
          setIsLoading(false);
        },
        async () => {
          const imageUrl = await getDownloadURL(storageRef);
          const locationRef = doc(db, 'Locations', locationId);

          const docRef = await addDoc(collection(db, 'UserUploads'), {
            location_qr_code: locationRef,
            url: imageUrl,
            metadata: {
              user_name: name || 'Anonymous',
              user_note: note || 'Empty Note',
              capture_date_time: serverTimestamp(),
              device_name: null,
              device_browser: null
            },
            is_approved: false
          });

          const firebaseLink = `https://console.firebase.google.com/u/zalagats@gmail.com/project/orama-initiative/firestore/data/UserUploads/${docRef.id}`;

          sendEmailNotification(name || 'Anonymous', locationName, imageUrl, firebaseLink);

          setImageSrc(null);
          setName("");
          setNote("");
          showAlert('Image submitted successfully!', 'success');
          showCustomDialog('', '', <SuccessDialogComponent onClose={closeCustomDialog} goToGallery={() => router.push(`/locations/${locationId}/gallery`)} goToHome={() => router.push(`/`)} />);
          setUploadProgress(0);
          setIsLoading(false);
        }
      );

    } catch (error) {
      console.error("Error: ", error);
      showAlert("Failed to upload image. Please try again later.", "error");
      setIsLoading(false);
    }
  };

  const sendEmailNotification = (userName, userEmail, imageUrl, firebaseLink) => {
    const SERVICE_ID = process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_ID;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_TEMPLATE;
    const USER_ID = process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_PUBLIC_KEY;

    const templateParams = {
      user_name: userName,
      user_email: userEmail,
      imageUrl: imageUrl, // Dynamic image URL
      firebaseLink: firebaseLink // Dynamic Firestore link
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (error) => {
        console.log('FAILED...', error);
      });
  }

  return (
    <div className="px-10 sm:px-20 md:px-24 lg:px-16 xl:px-8 mx-auto max-w-[75rem]">
      <Head>
        <title>Capture an Image | Orama</title>
        <link rel="icon" href="/Avatar-white.svg" />
      </Head>
      <main className="min-h-screen max-w-screen">
        <div className="pt-10 flex flex-col items-center mx-auto">
          <div className="select-none flex justify-center space-x-4 items-center mt-2 mb-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="14"
              fill="currentColor"
              className=" fill-gray-300  rotate-180"
            >
              <path d="M0.466181 9.35938C1.28178 11.6167 3.44138 14 6.28256 14L6.40126 13.9497C7.46574 13.917 8.6719 13.5571 9.63683 12.8442C10.3414 12.3223 10.9196 11.6108 11.2144 10.6987C11.3982 10.0728 11.4556 9.4126 11.3791 8.76221C11.3025 8.11182 11.0919 7.48584 10.7664 6.92579C10.3184 6.20362 9.69044 5.62452 8.9476 5.25293C8.20475 4.88135 7.37767 4.73145 6.55825 4.81934C6.47401 4.82325 6.38977 4.84473 6.31319 4.88331C6.23661 4.92188 6.16768 4.97657 6.11025 5.04346C6.05664 5.11036 6.01069 5.18848 5.98389 5.27295C5.96091 5.35791 5.94943 5.44727 5.95708 5.53614C5.95708 5.62696 5.9724 5.71729 6.01069 5.80079C6.04515 5.88379 6.09876 5.95801 6.16385 6.01758C6.22895 6.07764 6.30553 6.12159 6.38977 6.14698C6.47401 6.17237 6.56208 6.17872 6.65015 6.16504C7.15941 6.08985 7.684 6.15137 8.16646 6.34375C8.64893 6.53614 9.07778 6.85303 9.41474 7.26465C9.7517 7.67676 9.98145 8.1709 10.0848 8.70069C10.1882 9.23047 10.1614 9.7793 10.0121 10.2964C9.49133 11.9565 7.56913 12.6104 6.40126 12.648C4.22634 12.7236 2.35392 10.8057 1.65703 8.875C1.45791 8.34717 1.33538 7.79346 1.28943 7.23243C1.25497 6.78614 1.27029 6.33497 1.33538 5.88868C1.48472 4.88086 1.88294 3.93262 2.49942 3.14014C3.64815 1.75049 5.49376 1.12159 7.68783 1.3667C10.2495 1.65625 12.0147 3.49854 12.8609 4.37891C13.0141 4.54737 13.1787 4.73926 13.351 4.94581L13.7263 5.41016C15.2503 7.30323 17.5401 10.1704 21.6065 8.32178C22.1771 8.01563 22.6557 7.55323 22.9927 6.98389C23.2645 6.53174 23.4368 6.0254 23.4981 5.5H123.51C123.659 5.5 123.789 5.4336 123.877 5.32862C123.954 5.24073 124 5.12598 124 5C124 4.72364 123.782 4.5 123.51 4.5H23.4598C23.3488 3.93848 23.1075 3.41211 22.7476 2.97266C22.2613 2.38233 21.5951 1.98584 20.8599 1.85108C20.4923 1.81055 20.1209 1.83838 19.7647 1.93067C19.5159 1.99561 19.2746 2.09229 19.0449 2.21973C18.4858 2.52881 18.0302 3.00489 17.7315 3.58643C17.6817 3.66358 17.6434 3.75147 17.6243 3.84424L17.6166 3.93897C17.6128 4.00147 17.6166 4.06397 17.6281 4.125C17.6511 4.21729 17.6894 4.30372 17.743 4.37891C17.8004 4.45459 17.8694 4.51661 17.9459 4.56153L18.057 4.60987C18.1068 4.62598 18.1565 4.63624 18.2063 4.64014C18.2638 4.64454 18.325 4.64014 18.3825 4.62647L18.4705 4.60059C18.5548 4.56788 18.6352 4.51661 18.6964 4.4502C18.7386 4.40723 18.773 4.35791 18.8037 4.30469L18.8458 4.21534C19.0181 3.86573 19.2861 3.57813 19.6154 3.3877C19.9485 3.19727 20.3238 3.11377 20.699 3.14649C21.1317 3.2417 21.5185 3.4878 21.8018 3.84375C22.0852 4.2002 22.2422 4.646 22.2498 5.1084C22.2307 5.51172 22.1158 5.9043 21.9167 6.24903C21.7176 6.59424 21.4342 6.88086 21.1011 7.08301C17.9 8.57325 16.2037 6.45411 14.7065 4.56788L14.6261 4.46241C14.3121 4.08252 14.0364 3.73633 13.7646 3.44825C12.8839 2.53663 10.8353 0.398442 7.82568 0.0590868C5.20658 -0.230464 2.96657 0.549321 1.53449 2.28516C0.979278 2.99317 0.565737 3.8042 0.30536 4.67237C0.209633 4.99805 0.133051 5.33155 0.0832729 5.67041C-0.104352 6.91358 0.0258367 8.18702 0.466181 9.35938Z"></path>
            </svg>
            <div className="text-[#000] dark:text-[#fff] flex flex-col items-center justify-center">
  <h2 className="selection:text-black/40 dark:selection:text-white/40 bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent text-center mx-auto text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
    {locationName}
  </h2>
</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="14"
              fill="currentColor"
              className=" fill-gray-300 -rotate-0 -scale-y-100 "
            >
              <path d="M0.466181 9.35938C1.28178 11.6167 3.44138 14 6.28256 14L6.40126 13.9497C7.46574 13.917 8.6719 13.5571 9.63683 12.8442C10.3414 12.3223 10.9196 11.6108 11.2144 10.6987C11.3982 10.0728 11.4556 9.4126 11.3791 8.76221C11.3025 8.11182 11.0919 7.48584 10.7664 6.92579C10.3184 6.20362 9.69044 5.62452 8.9476 5.25293C8.20475 4.88135 7.37767 4.73145 6.55825 4.81934C6.47401 4.82325 6.38977 4.84473 6.31319 4.88331C6.23661 4.92188 6.16768 4.97657 6.11025 5.04346C6.05664 5.11036 6.01069 5.18848 5.98389 5.27295C5.96091 5.35791 5.94943 5.44727 5.95708 5.53614C5.95708 5.62696 5.9724 5.71729 6.01069 5.80079C6.04515 5.88379 6.09876 5.95801 6.16385 6.01758C6.22895 6.07764 6.30553 6.12159 6.38977 6.14698C6.47401 6.17237 6.56208 6.17872 6.65015 6.16504C7.15941 6.08985 7.684 6.15137 8.16646 6.34375C8.64893 6.53614 9.07778 6.85303 9.41474 7.26465C9.7517 7.67676 9.98145 8.1709 10.0848 8.70069C10.1882 9.23047 10.1614 9.7793 10.0121 10.2964C9.49133 11.9565 7.56913 12.6104 6.40126 12.648C4.22634 12.7236 2.35392 10.8057 1.65703 8.875C1.45791 8.34717 1.33538 7.79346 1.28943 7.23243C1.25497 6.78614 1.27029 6.33497 1.33538 5.88868C1.48472 4.88086 1.88294 3.93262 2.49942 3.14014C3.64815 1.75049 5.49376 1.12159 7.68783 1.3667C10.2495 1.65625 12.0147 3.49854 12.8609 4.37891C13.0141 4.54737 13.1787 4.73926 13.351 4.94581L13.7263 5.41016C15.2503 7.30323 17.5401 10.1704 21.6065 8.32178C22.1771 8.01563 22.6557 7.55323 22.9927 6.98389C23.2645 6.53174 23.4368 6.0254 23.4981 5.5H123.51C123.659 5.5 123.789 5.4336 123.877 5.32862C123.954 5.24073 124 5.12598 124 5C124 4.72364 123.782 4.5 123.51 4.5H23.4598C23.3488 3.93848 23.1075 3.41211 22.7476 2.97266C22.2613 2.38233 21.5951 1.98584 20.8599 1.85108C20.4923 1.81055 20.1209 1.83838 19.7647 1.93067C19.5159 1.99561 19.2746 2.09229 19.0449 2.21973C18.4858 2.52881 18.0302 3.00489 17.7315 3.58643C17.6817 3.66358 17.6434 3.75147 17.6243 3.84424L17.6166 3.93897C17.6128 4.00147 17.6166 4.06397 17.6281 4.125C17.6511 4.21729 17.6894 4.30372 17.743 4.37891C17.8004 4.45459 17.8694 4.51661 17.9459 4.56153L18.057 4.60987C18.1068 4.62598 18.1565 4.63624 18.2063 4.64014C18.2638 4.64454 18.325 4.64014 18.3825 4.62647L18.4705 4.60059C18.5548 4.56788 18.6352 4.51661 18.6964 4.4502C18.7386 4.40723 18.773 4.35791 18.8037 4.30469L18.8458 4.21534C19.0181 3.86573 19.2861 3.57813 19.6154 3.3877C19.9485 3.19727 20.3238 3.11377 20.699 3.14649C21.1317 3.2417 21.5185 3.4878 21.8018 3.84375C22.0852 4.2002 22.2422 4.646 22.2498 5.1084C22.2307 5.51172 22.1158 5.9043 21.9167 6.24903C21.7176 6.59424 21.4342 6.88086 21.1011 7.08301C17.9 8.57325 16.2037 6.45411 14.7065 4.56788L14.6261 4.46241C14.3121 4.08252 14.0364 3.73633 13.7646 3.44825C12.8839 2.53663 10.8353 0.398442 7.82568 0.0590868C5.20658 -0.230464 2.96657 0.549321 1.53449 2.28516C0.979278 2.99317 0.565737 3.8042 0.30536 4.67237C0.209633 4.99805 0.133051 5.33155 0.0832729 5.67041C-0.104352 6.91358 0.0258367 8.18702 0.466181 9.35938Z"></path>
            </svg>
          </div>

        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
            <span className="text-white text-lg mb-4">{Math.round(uploadProgress)}%</span>
            <div className="w-3/4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="xl:px-12  p-6 sm:p-8 md:px-10  bg-gradient-to-tr dark:from-[#df51ad3e] dark:to-[#eb587d2a] from-[#f6ebeb90] to-[#fff8ec60] flex flex-col lg:flex-row mx-auto rounded-3xl shadow-md drop-shadow-2xl backdrop-blur-xl items-center justify-center lg:justify-between w-full max-w-sm">
          <div className="order-2 lg:order-1 w-full flex flex-col space-y-6 bg-clip-text">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Capture an Image</h3>
              <button onClick={() => showCustomDialog('', '', <InstructionsDialog onClose={closeCustomDialog} locationId={locationId}/>)}>
                <FaInfoCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <label className="w-full h-52 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} capture />
              {imageSrc ? (
                <div className="relative w-full h-full">
                  <Image src={imageSrc} alt="Captured preview" layout="fill" objectFit="contain" className="rounded-lg" />
                </div>
              ) : (
                <div className="text-gray-400 text-center flex flex-col items-center">
                  <FaCamera className="w-12 h-12 mb-1" />
                  <span>Take a Photo</span>
                </div>
              )}
            </label>


            <input
              type="text"
              placeholder="Name/ Social(optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <textarea
              placeholder="Write a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
            ></textarea>

            <div className="group border-blue-400 hover:bg-blue-400 text-blue-500 hover:text-white hover:drop-shadow-2xl rounded-md md:rounded-xl px-2 py-1 md:px-4 md:py-2 shadow-md drop-shadow-lg dark:bg-blue-400 dark:shadow-none dark:hover:shadow-white select-none dark:text-white shadow-blue-300">
              <div
                onClick={confirmUpload}
                className="flex items-center justify-center font-normal lg:font-bold space-x-2 text-sm md:text-base cursor-pointer"
              >
                <p>Submit</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {dialog && <Dialog title={dialog.title} content={dialog.content} actions={dialog.actions} />}
      {customDialog && <CustomDialog title={customDialog.title} content={customDialog.content} actions={customDialog.actions} />}
    </div>
  );
};

export default LocationUpload;
