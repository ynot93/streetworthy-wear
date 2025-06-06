import heroImg from '../assets/hero-image.png';
import logoImg from '../assets/logo.png';
import { Link } from 'react-router-dom';

const HeroFC = () => (
  <section className='relative min-h-screen flex flex-col md:flex-row items-center justify-between p-4 bg-black text-white'>
    <div className="md:absolute md:top-0 md:left-4">
      <img src={logoImg} alt="Logo" className="h-28 w-auto" />
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/products">Browse Products</Link></li>
      </ul>
    </div>
    <div className='md:w-1/2 text-center'>
      <h1 className='text-6xl md:text-6xl font-bold'>We in The Streets</h1>
      <p className='text-2xl mt-2'>Streetwear built for the culture.</p>
    </div>
    <div className='md:w-1/2 mt-8'>
      <img src={heroImg} alt='Hero' className='rounded-xl' />
    </div>
  </section>
);

export default HeroFC;