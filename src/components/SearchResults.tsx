"use client";
import { useSearchParams } from "next/navigation";
import ListItem from "@/components/ListItem";
import { useSearchGigs } from "@/request-query/configRequests";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || ""; // используйте пустую строку, если q не определено
  const category = searchParams.get("category") || ""; // используйте пустую строку, если category не определено
  const { data: gigs, isLoading, isError } = useSearchGigs(q, category); // используйте useSearchGigs

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return (
    <>
      {gigs && (
        <div className="mx-24 mb-24 pt-28">
          {q && (
            <h3 className="text-4xl mb-10">
              Results for <strong>{q}</strong>
            </h3>
          )}
          <div className="flex gap-4">
            <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
              Category
            </button>
            <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
              Budget
            </button>
            <button className="py-3 px-5 border border-gray-400 rounded-lg font-medium">
              Delivery Time
            </button>
          </div>
          <div>
            <div className="my-4">
              <span className="text-[#74767e] font-medium ">
                {gigs.length} services available
              </span>
            </div>
            <div className="grid grid-cols-4">
              {gigs.map((gig) => (
                <ListItem gig={gig} key={gig.id} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResults;
