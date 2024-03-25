"use client";
import { useState } from "react";
import { useLogin, useRegister } from "../auth/configureAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MdFacebook } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
interface LoginFormProps {
  isRegisterMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isRegisterMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const queryClient = useQueryClient();
  const login = useLogin();
  const register = useRegister();
  const isLoading = login.isLoading || register.isLoading;
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          console.error("Passwords do not match");
          return;
        }
        await register.mutateAsync({ email, password });
      } else {
        await login.mutateAsync({ email, password });
      }
      queryClient.invalidateQueries({ queryKey: ["authenticated-user"] });
    } catch (error) {
      console.error("Ошибка входа", error);
    }
  };

  const handleSwitchMode = () => {
    if (isRegisterMode) {
      router.push("/?signin=true");
    } else {
      router.push("/?signup=true");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center p-8 gap-7">
        <h3 className="text-2xl font-semibold text-slate-700">
          {isRegisterMode ? "Login" : "Sign"}
          in to Fiverr
        </h3>
        <div className="flex flex-col gap-5">
          <button className="text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
            <MdFacebook className="absolute left-4 text-2xl" />
            Continue with Facebook
          </button>
          <button className="border border-slate-300 p-3 font-medium w-80 flex items-center justify-center relative">
            <FcGoogle className="absolute left-4 text-2xl" />
            Continue with Google
          </button>
        </div>
        <div className="relative  w-full text-center">
          <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
            <span className="bg-white relative z-10 px-2">OR</span>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-slate-300 p-3 w-80"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-slate-300 p-3 w-80"
            required
          />
          {isRegisterMode && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="border border-slate-300 p-3 w-80"
              required
            />
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
          >
            {isLoading ? "Loading..." : isRegisterMode ? "Signup" : "Signin"}
          </button>
        </form>
      </div>
      <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
        <span className="text-sm  text-slate-700">
          {" "}
          {!isRegisterMode ? (
            <>
              Not a member yet?&nbsp;
              <span
                className="text-[#1DBF73] cursor-pointer"
                onClick={handleSwitchMode}
              >
                Join Now
              </span>
            </>
          ) : (
            <>
              Already a member?&nbsp;
              <span
                className="text-[#1DBF73] cursor-pointer"
                onClick={handleSwitchMode}
              >
                Login Now
              </span>
            </>
          )}
        </span>
      </div>
    </>
  );
};

export default LoginForm;
