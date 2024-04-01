import { useAddReview } from "@/request-query/configRequests";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

function AddReview({ gigId }: { gigId: number }) {
  const [data, setData] = useState({ reviewText: "", rating: 0 });
  const addReviewMutation = useAddReview(gigId);

  const addReview = () => {
    addReviewMutation.mutate(data, {
      onSuccess: () => {
        setData({ reviewText: "", rating: 0 });
        toast.success("Review submitted successfully!");
      },
    });
  };

  return (
    <div className="mb-10">
      <h3 className="text-2xl my-5 font-normal   text-[#404145]">
        Give Kishan Sheth a Review
      </h3>

      <div className="flex  flex-col  items-start justify-start gap-3">
        <textarea
          name="reviewText"
          id="reviewText"
          onChange={(e) => setData({ ...data, reviewText: e.target.value })}
          value={data.reviewText}
          className="block p-2.5 w-4/6 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Add Review"
        ></textarea>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`cursor-pointer ${
                data.rating >= num ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setData({ ...data, rating: num })}
            />
          ))}
        </div>
        <button
          className="flex items-center bg-[#1DBF73] text-white py-2 justify-center text-md relative rounded px-5"
          onClick={addReview}
        >
          Add Review
        </button>
      </div>
    </div>
  );
}

export default AddReview;
