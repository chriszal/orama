import Image from "next/image";
import { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import Rectangle from "../public/Rectangle.svg";

const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_ID,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_TEMPLATE,
      form.current,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_PUBLIC_KEY
    )
    .then((result) => {
        console.log(result.text);
        if (result.text === "OK") {
          form.current.reset();
          setIsSent(true);
        } else {
          setIsError(true);
        }
    }, (error) => {
        console.log(error.text);
        setIsError(true);
    });
  };

  const handleClose = () => {
    setIsSent(false);
    setIsError(false);
  };

  return (
    <div className="h-max xl:px-12 lg:h-[30rem] p-6 sm:p-8 md:px-10 pt-32 md:pt-40 lg:pt-10 bg-gradient-to-tr dark:from-[#df51ad3e] dark:to-[#eb587d2a] from-[#f6ebeb90] to-[#fff8ec60] flex flex-col lg:flex-row mx-auto rounded-3xl shadow-md drop-shadow-2xl backdrop-blur-xl items-center justify-center lg:justify-between">
      <div className="order-2 lg:order-1 sm:w-[75%] lg:w-[60%] flex flex-col space-y-6 bg-clip-text">
        <h2 className="tracking-normal bg-gradient-to-br from-blue-400 via-indigo-600 to-red-500 bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl font-semibold selection:text-gray-700 dark:selection:text-white/90">
          Say hi!
        </h2>
        <p className="text-sm md:text-md font-normal lg:text-lg xl:text-lg">
          If you have any questions or would like to discuss potential opportunities, please don&apos;t hesitate to reach out to us using the form below.
        </p>
        <form ref={form} onSubmit={sendEmail} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="user_name" placeholder="Name" required className="p-2 rounded border dark:bg-gray-800 dark:text-white" />
            <input type="email" name="user_email" placeholder="Email" required className="p-2 rounded border dark:bg-gray-800 dark:text-white" />
          </div>
          <textarea name="message" placeholder="Message" rows="4" required className="p-2 rounded border dark:bg-gray-800 dark:text-white"></textarea>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-indigo-700">Submit</button>
        </form>
        {isSent && (
          <div className="text-green-500">
            Email sent successfully!
          </div>
        )}
        {isError && (
          <div className="text-red-500">
            Email failed to send.
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2 flex-shrink-0 lg:ml-10">
        <Image
          src={Rectangle}
          alt="contact"
          width={750}
          height={650}
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          loading="lazy"
          className="select-none backdrop-shadow-xl h-24 w-24 md:h-40 md:w-44 lg:w-[15rem] lg:h-[16rem] xl:w-[16rem] xl:h-[18rem]"
        />
      </div>
    </div>
  );
};

export default Contact;
