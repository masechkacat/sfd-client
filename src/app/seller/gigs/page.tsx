"use client";
import { useUserGigs } from "@/request-query/configRequests";
import Link from "next/link";
import { BsTrash3Fill } from "react-icons/bs";

function Index() {
  const { data: gigs, isLoading, isError } = useUserGigs();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred</div>;
  }
  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32 pt-28">
      <h3 className="m-5 text-2xl font-semibold">All your Gigs</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {gigs?.map(({ title, category, price, deliveryTime, id }) => {
              return (
                <tr className="bg-white hover:bg-gray-50 " key={id}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {title}
                  </th>
                  <td className="px-6 py-4">{category}</td>
                  <td className="px-6 py-4">{price}</td>
                  <td className="px-6 py-4">{deliveryTime}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/seller/gigs/${id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <BsTrash3Fill className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Index;
