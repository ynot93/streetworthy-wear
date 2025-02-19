import heroImg from '../assets/hero-image.png';
import logoImg from '../assets/logo.png';

const HeroFC = () => (
  <section className='relative min-h-screen flex flex-col md:flex-row items-center justify-between p-4 bg-black text-white'>
    <div className="md:absolute md:top-0 md:left-4">
      <img src={logoImg} alt="Logo" className="h-28 w-auto" /> {/* Adjust h-16 for logo height */}
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