import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const AddReviewForm = ({ onReviewAdded }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [product_id, setProductId] = useState(""); 
  const [products, setProducts] = useState([]); 
  const [user, setUser] = useState(null); 
  const [error, setError] = useState(null);


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const username = Cookies.get("username");
  //     if (username) {
  //       try {
  //         const response = await fetch(`http://127.0.0.1:5555/users`);
  //         const users = await response.json();
  //         const loggedInUser = users.find((u) => u.username === username);
  //         setUser(loggedInUser);
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:5555/products");
  //       const productsData = await response.json();
  //       setProducts(productsData); 
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }

    const newReview = {
      user_id: user.id, 
      comment,
      rating: parseInt(rating),
      product_id: parseInt(product_id), 
    };

    try {
      const response = await fetch(`http://127.0.0.1:5555/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const data = await response.json();
      console.log("New review added:", data);

      onReviewAdded(data);

      setComment("");
      setRating("");
      setProductId("");
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add review. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Your Review</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <>
          <div>
            <label>Product:</label>
            <select
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="" disabled>Select a phone</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.processor} (${product.price})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Rating:</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>
          <button type="submit">Submit Review</button>
        </>
      ) : (
        <p>Please <a href="/login">log in</a> to add a review.</p>
      )}
    </form>
  );
};

export default AddReviewForm;
