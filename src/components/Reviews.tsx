import { ReviewsProps } from "@/utils/types";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

function Reviews({ reviews, averageRating, totalReviewsCount }: ReviewsProps) {
  return (
    <>
      {reviews && (
        <div className="mb-10">
          <h3 className="text-2xl my-5 font-normal text-[#404145] ">Reviews</h3>
          <div className="flex gap-3 mb-5">
            <h5>{totalReviewsCount} reviews for this Gig</h5>
            <div className="flex text-yellow-500 items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${
                      Math.ceil(averageRating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>{averageRating}</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {reviews.map((review) => (
              <div className="flex gap-3 border-t pt-6" key={review.id}>
                <div>
                  {review.reviewer.profileImage ? (
                    <Image
                      src={review.reviewer.profileImage}
                      alt="Profile"
                      height="0"
                      width="0"
                      sizes="100vw"
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative">
                      <span className="text-xl text-white">
                        {review.reviewer.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h4>{review.reviewer.fullName}</h4>
                  <div className="flex text-yellow-500 items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer ${
                            review.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span>{review.rating}</span>
                  </div>
                  <p className="text-[#404145] pr-20">{review.reviewText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Reviews;
