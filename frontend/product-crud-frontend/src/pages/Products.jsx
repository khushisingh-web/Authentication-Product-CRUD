import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const getProducts = async () => {
    try {
      const response = await api.get("/products");

      console.log("PRODUCTS:", response.data);

      setProducts(response.data.data || []);
    } catch (error) {
      console.log("GET PRODUCTS ERROR:", error.response?.data);
      alert(JSON.stringify(error.response?.data || "Failed to get products"));
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
        });

        alert("Product updated successfully");
      } else {
        await api.post("/products", {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
        });

        alert("Product created successfully");
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
      });

      setEditingId(null);

      getProducts();
    } catch (error) {
      console.log("PRODUCT ERROR:", error.response?.data);

      alert(JSON.stringify(error.response?.data || "Product operation failed"));
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully");

      getProducts();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data);

      alert(JSON.stringify(error.response?.data || "Failed to delete product"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Product Management
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-2xl font-bold mb-5">
            {editingId ? "Update Product" : "Add Product"}
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Product description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                });
              }}
              className="w-full bg-gray-500 text-white p-3 rounded mt-3"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              No products found
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold">{product.name}</h2>

                <p className="mt-2">
                  <strong>Description:</strong> {product.description}
                </p>

                <p className="mt-2">
                  <strong>Price:</strong> ₹{product.price}
                </p>

                <p className="mt-2">
                  <strong>Stock:</strong> {product.stock}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
