// Questionnaire component
const Questionnaire: React.FC = () => (
  <section className="h-[75vh] flex flex-col items-center justify-center p-8 bg-cover bg-center bg-black text-white text-center">
    <h2 className="text-4xl font-bold">This product is not yet available in your area.</h2>
    <p className="text-2xl mt-2">Click here to add you to a waiting list</p>
    <a
      href="https://forms.gle/3wobcAJWgsqE3Md16"
      target="_blank" // Opens in a new tab
      rel="noopener noreferrer" // Important for security when opening new tabs
    >
      <button
        type="button"
        className="mt-4 bg-white text-black px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-gray-700 hover:text-white"      >
        Waiting List
      </button>
    </a>
  </section>
);

export default Questionnaire;