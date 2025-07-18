import { useState, useEffect } from 'react';

type Product = {
    name: string;
    price: number;
    image: string;
  };
  
  const ProductShowcase: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data));
    }, []);

    return (
      <section className="h-fit p-8 bg-black text-white text-center">
      <h2 className="text-3xl font-bold">Here is what we have in store for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((item) => (
          <div key={item.name} className="bg-gray-700 p-4 rounded-lg transition duration-200 ease-in-out hover:scale-103 hover:translate-y-0.5">
            <img src={`http://localhost:3001${item.image}`} alt={item.name} className="rounded-lg" />
            <p className="mt-2">{item.name} - KES {item.price}</p>
          </div>
        ))}
      </div>
    </section>
    )
  };
  export default ProductShowcase;