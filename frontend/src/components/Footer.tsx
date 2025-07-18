import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const openWhatsapp = () => {
    const phoneNumber = '+254772118315';
    const whatsappURL = `https://wa.me/${phoneNumber}}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <footer className="h-[60vh] p-8 bg-white text-black text-center relative flex flex-col">
      <h2 className="text-4xl font-bold">Get in touch with us</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 text-lg">
        <div>
          <h3 className="font-bold">Phone</h3>
          <p>+254 772 118 315</p>
          <p>+254 720 220 524</p>
        </div>
        <div>
          <h3 className="font-bold">Email</h3>
          <p>info@streetworthy.com</p>
        </div>
        <div>
          <h3 className="font-bold">Socials</h3>
          <div className="flex justify-center space-x-4">
            <a href="YOUR_FACEBOOK_URL" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
            </a>
            <a href="YOUR_INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
            </a>
            <a href="YOUR_TWITTER_URL" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Whatsapp</h3>
          <button onClick={openWhatsapp}>
            <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Created by Nadia & Tony
      </div>
    </footer>
  );
};

export default Footer;