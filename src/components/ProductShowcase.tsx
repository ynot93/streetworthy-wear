import product1 from '../assets/product1.png';
import product2 from '../assets/product2.png';
import product3 from '../assets/product3.png';

type Product = {
    name: string;
    price: number;
    image: string;
  };
  
  const products: Product[] = [
    { name: "Blue Hoodie", price: 3000, image: product1 },
    { name: "Yellow Hoodie", price: 3000, image: product2 },
    { name: "White Hoodie", price: 3000, image: product3 },
  ];
  
  const ProductShowcase: React.FC = () => (
    <section className="h-fit p-8 bg-black text-white text-center">
      <h2 className="text-3xl font-bold">Here is what we have in store for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((item) => (
          <div key={item.name} className="bg-gray-700 p-4 rounded-lg transition duration-200 ease-in-out hover:scale-103 hover:translate-y-0.5">
            <img src={item.image} alt={item.name} className="rounded-lg" />
            <p className="mt-2">{item.name} - KES {item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
  export default ProductShowcase;