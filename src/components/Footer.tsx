const Footer: React.FC = () => (
    <footer className="p-8 bg-white text-black">
      <h2 className="text-2xl font-bold">Get in touch with us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-4">
        <div><h3>Phone</h3><p>+123 456 789</p></div>
        <div><h3>Email</h3><p>contact@streetworthy.com</p></div>
        <div><h3>Socials</h3><p>@streetworthy</p></div>
      </div>
    </footer>
  );
  export default Footer;