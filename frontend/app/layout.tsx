// app/layout.tsx
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Marimekko Wholesale",
  description: "B2B portal for wholesale clients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>    
        <div>
      <nav className="flex items-center justify-center gap-8 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 font-medium">
        <Link href="/dashboard" className="hover:text-rose-500">Dashboard</Link>
        <Link href="/profile" className="hover:text-rose-500">Profile</Link>
        <Link href="/clients" className="hover:text-rose-500">Clients</Link>
        <Link href="/health" className="hover:text-rose-500">Health</Link>
        <Link href="/logout" className="hover:text-rose-500">Logout</Link>
      </nav>
      {children}
    </div>
    </body>
    </html>
  );
}

