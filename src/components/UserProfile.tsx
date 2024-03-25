// src/components/UserProfile.tsx
"use client";
import { useUser } from "../auth/configureAuth";

const UserProfile: React.FC = () => {
  const { data: user, isLoading, isError, error } = useUser();

  if (isLoading) return <div>Loading user data...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {user && (
        <ul>
          <li>Email: {user.email}</li>
          <li>username: {user.username}</li>
          {/* Отобразите другие необходимые данные пользователя */}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;
