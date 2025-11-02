// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Marimekko Wholesale",
  description: "B2B portal for wholesale clients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
