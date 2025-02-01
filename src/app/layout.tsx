import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import BootstrapClient from "../components/BootstrapClient";
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
const tiro_bangla = localFont({
  src: [
    {
      path: "./fonts/Tiro.ttf",
    },
  ],
  variable: "--font-tiro",
});

const roboto = localFont({
  src: [
    {
      path: "./fonts/times.ttf",
    },
  ],
  variable: "--font-roboto",
})
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
