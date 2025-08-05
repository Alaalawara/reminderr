import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const InsrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata = {
  title: "reminderr",
  description: "let me remind you!",
  keywords: ["reminder", "notifications",],
  authors: [{ name: "Swaraj Sanap", url: "https://github.com/Alaalawara" }],
  creator: "Swaraj Sanap",
  openGraph: {
    title: "reminderr",
    description: "Let me remind you!",
    url: "https://reminderr.vercel.app",
    siteName: "reminderr",
    images: [
      {
        url: "https://reminderr.vercel.app",
        width: 1200,
        height: 630,
        alt: "reminderr app preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
   twitter: {
    card: "summary_large_image",
    title: "swarajdev",
    description: "Let me remind you!",
    images: ["https://x.com/loops_infinity"],
    creator: "@loops_infinity",
  },
  icons: {
    icon: "/favicon.ico",
  },
  github:{
     card: "summary_large_image",
    title: "Ala_ala_wara",
    description: "Let me remind you!",
    images: ["https://github.com/Alaalawara"],
    creator: "@Alaalawara",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${InsrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
