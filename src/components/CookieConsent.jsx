import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center w-[23vw] max-md:w-[80vw] bg-white text-gray-500 p-4 md:p-6 rounded-lg border border-gray-500/30 text-sm">
        <div className="flex items-center justify-center relative w-full gap-2 pb-3">
          <img
            className="absolute -top-10 md:-top-12"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/cookies/cookieImage2.svg"
            alt="Cookies"
          />
          <h1 className="text-gray-800 text-2xl font-medium w-full pt-3">
            Your privacy is important to us
          </h1>
        </div>

        <p>
          We process your personal information to measure and improve our sites
          and services, to assist our campaigns and to provide personalised
          content. For more information see our{" "}
          <a href="#" className="font-medium underline">
            Privacy Policy
          </a>.
        </p>

        <div className="flex items-center justify-between mt-6 gap-3 w-full">
          <a className="underline" href="#">
            More Option
          </a>
          <button
            type="button"
            className="bg-[#aacd41] px-6 py-2 rounded text-white font-medium active:scale-95 transition"
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
