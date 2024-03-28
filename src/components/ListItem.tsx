"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { ListGig } from "@/utils/types";

function ListItem({ gig }: { gig: ListGig }) {
  const router = useRouter();
  return (
    <div
      className="max-w-[300px] flex flex-col gap-2 p-1 cursor-pointer mb-8"
      onClick={() => router.push(`/gigs/${gig.id}`)}
    >
      <div className="relative w-64 h-40">
        <Image src={gig.images[0]} alt="gig" fill className="rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        <div>
          {gig.createdBy.profileImage ? (
            <Image
              src={gig.createdBy.profileImage}
              alt="profile"
              height="0"
              width="0"
              sizes="100vw"
              className="rounded-full object-cover w-6 h-6"
            />
          ) : (
            <div className="bg-purple-500 h-7 w-7 flex items-center justify-center rounded-full relative">
              <span className="text-lg text-white">
                {gig.createdBy.email[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <span className="text-md ">
          <strong className="font-medium">{gig.createdBy.username}</strong>
        </span>
      </div>
      <div>
        <p className="line-clamp-2 text-[#404145]">{gig.title}</p>
      </div>
      <div className="flex items-center gap-1 text-yellow-400">
        <FaStar />
        <span>
          <strong className="font-medium">{gig.averageRating}</strong>
        </span>
        <span className="text-[#74767e]">({gig.totalReviewsCount})</span>
      </div>
      <div>
        <strong className="font-medium">From ${gig.price}</strong>
      </div>
    </div>
  );
}

export default ListItem;
