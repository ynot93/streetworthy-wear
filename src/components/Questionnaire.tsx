type HoodieColor = 'blue' | 'yellow' | 'white';

const Questionnaire: React.FC = () => (
  <section className="p-8 bg-cover bg-center text-white" style={{ backgroundImage: 'url("../assets/background.jpg")' }}>
    <h2 className="text-3xl font-bold">Create with us</h2>
    <p className="text-lg mt-2">Which hoodie do you like?</p>
    <form action="https://forms.google.com" target="_blank" className="mt-4">
      {(["blue", "yellow", "white"] as HoodieColor[]).map((color) => (
        <label key={color} className="block">
          <input type="radio" name="hoodie" value={color} /> {color.charAt(0).toUpperCase() + color.slice(1)}
        </label>
      ))}
      <button type="submit" className="mt-4 bg-white text-black px-4 py-2 rounded">Submit</button>
    </form>
  </section>
);

export default Questionnaire;