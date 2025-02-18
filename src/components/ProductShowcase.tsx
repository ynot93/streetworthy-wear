type Product = {
    name: string;
    price: number;
  };
  
  const products: Product[] = [
    { name: "Hoodie 1", price: 3000 },
    { name: "Hoodie 2", price: 3000 },
    { name: "Hoodie 3", price: 3000 },
  ];
  
  const ProductShowcase: React.FC = () => (
    <section className="p-8">
      <h2 className="text-3xl font-bold">Here is what we have in store for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((item) => (
          <div key={item.name} className="bg-gray-800 p-4 rounded-lg">
            <img src="../assets/product.png" alt={item.name} className="rounded-lg" />
            <p className="mt-2">{item.name} - ${item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
  export default ProductShowcase;