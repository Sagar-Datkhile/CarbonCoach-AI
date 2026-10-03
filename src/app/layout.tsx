import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carbon Coach — Green Energy Intelligence",
  description:
    "Turn electricity bills into understandable insights and achievable energy-saving actions with deterministic modeling and private data control.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("carboncoach_theme")?.value;
  const isDark = themeCookie === "dark";

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full ${isDark ? "dark" : ""}`}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const match = document.cookie.match(/(?:^|; )carboncoach_theme=(light|dark)/);
                const theme = match ? match[1] : (localStorage.getItem('carboncoach_theme') || 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-[#FAFBF8] text-[#111827] dark:bg-[#0B0F17] dark:text-[#F9FAFB]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
