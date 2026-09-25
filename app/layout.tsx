import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Gaurav Pathak — Software Developer (Next.js/Node.js) | AI, RAG, Voice AI & Computer Vision",
  description:
    "Software developer building web and mobile products with Next.js, Node.js, React Native, FastAPI and PostgreSQL — plus LLM, RAG, voice AI and computer-vision features for Indian, Canadian and US-based clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
