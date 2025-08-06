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
