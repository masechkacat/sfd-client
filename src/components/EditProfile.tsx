"use client";
import {
  useUpdateProfile,
  useUploadAvatar,
  useUser,
} from "@/request-query/configRequests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

function EditProfile() {
  const { data: user, isLoading: isLoadingUser, refetch } = useUser();
  const router = useRouter();
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    email: "",
    username: "",
    fullName: "",
    description: "",
  });
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  useEffect(() => {
    if (user) {
      setData({
        email: user.email || "",
        username: user.username || "",
        fullName: user.fullName || "",
        description: user.description || "",
      });
      // Предположим, что у вас есть URL аватара в user.avatarUrl
      setImage(user.profileImage);
    }
  }, [user]);
  // Обработчик для изменения полей ввода
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // Обработчик для загрузки изображения
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      if (!file) {
        console.log("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await uploadAvatar.mutateAsync(formData);
        console.log("Image upload response:", response);
        setImage(response.data.profileImage); // Обновляем состояние изображения
        refetch(); // Обновляем данные пользователя
      } catch (error) {
        console.log("Image upload error:", error);
        setErrorMessage("Failed to upload image");
      }
    }
  };

  // Обработчик для обновления профиля
  const setProfile = async () => {
    try {
      const response = await updateProfile.mutateAsync(data);
      console.log("Profile update response:", response);
      router.push("/profile");
    } catch (error) {
      console.log("Profile update error:", error);
      setErrorMessage("Failed to update profile");
    }
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900  dark:text-white";
  return (
    <>
      {!isLoadingUser && (
        <div className="flex flex-col items-center justify-start min-h-[80vh] gap-3">
          {errorMessage && (
            <div>
              <span className="text-red-600 font-bold">{errorMessage}</span>
            </div>
          )}
          <h2 className="text-3xl">Welocme to Fiverr Clone</h2>
          <h4 className="text-xl">
            Please complete your profile to get started
          </h4>
          <div className="flex flex-col items-center w-full gap-5">
            <div
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <label className={labelClassName} htmlFor="">
                Select a profile Picture
              </label>
              <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
                {image ? (
                  <Image
                    src={image}
                    alt="profile"
                    fill
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-6xl text-white">
                    {data?.email ? data.email[0].toUpperCase() : "✌️"}
                  </span>
                )}
                <div
                  className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center   transition-all duration-100  ${
                    imageHover ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span
                    className={` flex items-center justify-center  relative`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-white absolute"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={handleFile}
                      className="opacity-0"
                      multiple={true}
                      name="profileImage"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 w-[500px]">
              <div>
                <label className={labelClassName} htmlFor="username">
                  Please select a username
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  value={data.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClassName} htmlFor="fullName">
                  Please enter your full Name
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Full Name"
                  value={data.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-[500px]">
              <label className={labelClassName} htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={data.description}
                onChange={handleChange}
                className={inputClassName}
                placeholder="description"
              ></textarea>
            </div>
            <button
              className="border   text-lg font-semibold px-5 py-3   border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
              type="button"
              onClick={setProfile}
            >
              Set Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EditProfile;
