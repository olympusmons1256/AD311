import React from "react";

const products = [
  { id: 1, name: "Laptop", description: "High-performance laptop for professionals.", price: 1200 },
  { id: 2, name: "Smartphone", description: "Latest model with advanced features.", price: 800 },
  { id: 3, name: "Headphones", description: "Noise-cancelling over-ear headphones.", price: 150 },
  { id: 4, name: "Monitor", description: "27-inch 4K UHD display.", price: 350 },
  { id: 5, name: "Keyboard", description: "Mechanical keyboard with RGB lighting.", price: 100 },
];

export default function ProductList() {
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Product List</h2>
      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            background: "#fafafa"
          }}
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
        </div>
      ))}
    </div>
  );
}
