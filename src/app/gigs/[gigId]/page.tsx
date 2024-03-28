"use client";
import Details from "@/components/ItemDetails";
import { useGigDetails } from "@/request-query/configRequests";
import withAuth from "@/hoc/withAuth";
import Pricing from "@/components/Pricing";

function GigDetails({ params }: { params: { gigId: string } }) {
  const id = params.gigId;
  const { data: gigData, isLoading } = useGigDetails(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 mx-32 gap-20 pt-28">
      {gigData ? (
        <>
          <Details gigData={gigData} /> <Pricing gigData={gigData} />
        </>
      ) : (
        "No data"
      )}
    </div>
  );
}

export default withAuth(GigDetails); // Обернули GigDetails в HOC withAuth
