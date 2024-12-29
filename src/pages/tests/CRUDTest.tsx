import React, { useState, useEffect } from 'react';
import { productsService } from '../../lib/supabase/services/inventory';
import { useAuth } from '../../contexts/AuthContext';

type Product = Database['public']['Tables']['products']['Row'];

export default function CRUDTest() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [output, setOutput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">CRUD Test</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please log in to test CRUD operations
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await productsService.getAll();
      setProducts(data);
      setOutput('Products loaded successfully');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleCreate = async () => {
    try {
      const product = await productsService.create({
        name,
        unit_price: parseFloat(price),
        stock_quantity: 0,
        minimum_stock: 0
      });
      setOutput(`Created product: ${JSON.stringify(product, null, 2)}`);
      loadProducts();
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const product = await productsService.update(selectedProduct.id, {
        name,
        unit_price: parseFloat(price)
      });
      setOutput(`Updated product: ${JSON.stringify(product, null, 2)}`);
      loadProducts();
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsService.delete(id);
      setOutput(`Deleted product: ${id}`);
      loadProducts();
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CRUD Test</h1>

      <div className="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      <div className="space-x-4 mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create
        </button>
        <button
          onClick={handleUpdate}
          disabled={!selectedProduct}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Update Selected
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Products:</h2>
        <div className="space-y-2">
          {products.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>{product.name} - €{product.unit_price}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setName(product.name);
                    setPrice(product.unit_price.toString());
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Output:</p>
        <pre className="bg-gray-100 p-2 rounded">
          {output}
        </pre>
      </div>
    </div>
  );
}