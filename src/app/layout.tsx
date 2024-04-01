import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryProvider } from "../components/QueryProvider";
import Navbar from "../components/Navbar";
import { AuthModalProvider } from "../context/AuthModalContext";
import { ToastContainer, Flip } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative flex flex-col h-screen justify-between`}
      >
        <QueryProvider>
          <AuthModalProvider>
            <Navbar />
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Flip}
            />
          </AuthModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
