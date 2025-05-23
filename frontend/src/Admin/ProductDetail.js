import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.BACKEND_API}/product/${productId}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [productId]);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.product[0].name}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.product[0].description}</p>
    </div>
  );
};

export default ProductDetails;
