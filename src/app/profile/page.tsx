"use client";
import UserProfile from "@/components/UserProfile";
import withAuth from "@/hoc/withAuth";

function UserProfilePage() {
  return (
    <div className="pt-28">
      <UserProfile />;
    </div>
  );
}

export default withAuth(UserProfilePage);
