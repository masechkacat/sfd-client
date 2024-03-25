"use client";
import Dashboard from "@/components/Dashboard";
import UserProfile from "@/components/UserProfile";
import withAuth from "@/hoc/withAuth";

function SellerPage() {
  return (
    <div className="flex flex-col gap-10 pt-28">
      <UserProfile />
      <Dashboard />
    </div>
  );
}

export default withAuth(SellerPage);
