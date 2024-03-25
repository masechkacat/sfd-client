import { useDashboardData } from "@/request-query/configRequests";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-10 w-full">
        <div
          className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => router.push("/seller/gigs")}
        >
          <h2 className="text-xl">Total Gigs</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            {dashboardData?.gigsCount}
          </h3>
        </div>
        <div
          className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => router.push("/seller/orders")}
        >
          <h2 className="text-xl">Total Orders</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            {dashboardData?.ordersCount}
          </h3>
        </div>
        <div
          className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => router.push("/seller/unread-messages")}
        >
          <h2 className="text-xl"> Unread Messages</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            {dashboardData?.unreadMessagesCount}
          </h3>
        </div>

        <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl">Earnings Today</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            ${dashboardData?.dailyRevenue}
          </h3>
        </div>
        <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl">Earnings Monthly</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            ${dashboardData?.monthlyRevenue}
          </h3>
        </div>
        <div className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl">Earnings Yearly</h2>
          <h3 className="text-[#1DBF73] text-3xl font-extrabold">
            ${dashboardData?.annualRevenue}
          </h3>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
