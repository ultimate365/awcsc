import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import BootstrapClient from "../components/BootstrapClient";
import { Tiro_Bangla, Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalContextProvider } from "../context/Store";
const dejaVuBold = localFont({
  src: [
    {
      path: "./fonts/DejaVuSerifCondensed-Bold.ttf",
    },
  ],
  variable: "--font-dejaVuBold",
});
const dejaVuCondensed = localFont({
  src: [
    {
      path: "./fonts/DejaVuSerifCondensed.ttf",
    },
  ],
  variable: "--font-dejaVuCondensed",
});
const tiro_bangla = Tiro_Bangla({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-tiro",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-roboto",
});
export const metadata: Metadata = {
  title: "AWC Sports App",
  description: "Welcome To Amta West Circle's Sports Committee's Website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`container-fluid text-center text-black ${tiro_bangla.variable} ${roboto.variable} ${dejaVuBold.variable} ${dejaVuCondensed.variable}`}
        suppressHydrationWarning={true}
      >
        <GlobalContextProvider>
          <div className="noprint">
            <Header />
            <Navbar />
          </div>
          <div className="my-2">{children}</div>
          <Footer />
          <BootstrapClient />
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
          />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
