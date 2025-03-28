import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { addToCart } from "../utils/cart";
import { getImageUrl } from "../utils/media";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-8">Loading product...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* 🖼 Product Image */}
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="w-full rounded-lg"
      />

      {/* 📦 Product Details */}
      <div>
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-2">Brand: {product.brand}</p>
        <p className="text-lg font-medium text-black mb-4">${product.price}</p>
        <p className="text-sm text-gray-600 mb-6">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>

        {/* ✍️ Review Form */}
        {user && !reviewed && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-10 space-y-4 border-t pt-6"
          >
            <h4 className="font-semibold">Leave a Review</h4>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} - {["Terrible", "Bad", "Okay", "Good", "Great"][n - 1]}
                </option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your review..."
              className="w-full p-2 border rounded"
              rows={3}
            />
            <button className="bg-black text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </form>
        )}

        {/* ⭐ Reviews Section */}
        {product.reviews?.length > 0 && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            {product.reviews.map((review) => (
              <div key={review._id} className="mb-4 border-b pb-2">
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-gray-500">⭐ {review.rating}/5</p>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
