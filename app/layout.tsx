import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub — Manage Your Notes",
  description: "Easily create, edit, and organize your notes in one place.",
  openGraph: {
    title: "NoteHub — Manage Your Notes",
    description: "Easily create, edit, and organize your notes in one place.",
    url: "https://notehub.com",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <div id="modal-root"></div>
            <Footer />
          </AuthProvider>
          <ToastContainer />
        </TanStackProvider>
      </body>
    </html>
  );
}
