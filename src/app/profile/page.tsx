"use client";
import EditProfile from "@/components/EditProfile";
import withAuth from "@/hoc/withAuth";

function EditProfilePage() {
  return <EditProfile />;
}

export default withAuth(EditProfilePage);
