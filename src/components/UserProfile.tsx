// src/components/UserProfile.tsx
"use client";
import { useUser } from "../request-query/configRequests";
import Image from "next/image";

const UserProfile: React.FC = () => {
  const { data: userInfo, isLoading, isError, error } = useUser();

  if (isLoading) return <div>Loading user data...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {userInfo && (
        <div className="flex max-h-[70vh] my-10 mt-0 px-32 gap-5 pt-32">
          <div className="shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96">
            <div className="flex gap-5 justify-center items-center">
              <div>
                {userInfo?.profileImage ? (
                  <Image
                    src={userInfo.profileImage}
                    alt="Profile"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="rounded-full object-cover h-24 w-24"
                    priority
                  />
                ) : (
                  <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full relative">
                    <span className="text-5xl text-white">
                      {userInfo.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#62646a] text-lg font-medium">
                  {userInfo.username}
                </span>
                <span className="font-bold text-md">{userInfo.fullName}</span>
              </div>
            </div>
            <div className="border-t py-5">
              <p>{userInfo.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
