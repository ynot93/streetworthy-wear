import heroImg from '../assets/hero-image.png';

const HeroFC = () => (
  <section className='flex flex-col md:flex-row items-center justify-between p-8 bg-black text-white'>
    <div className='md:w-0.5'>
      <h1 className='text-4xl md:text-6xl font-bold'>We in The Streets.</h1>
      <p className='text-lg mt-2'>Streetwear built for the culture.</p>
    </div>
    <div className='md:w-0.5'>
      <img src={heroImg} alt='Hero' className='rounded-xl' />
    </div>
  </section>
);

export default HeroFC;