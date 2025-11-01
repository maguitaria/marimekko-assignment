export const metadata = { title: "Wholesale Storefront" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body style={{ fontFamily: "system-ui", margin: 0 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <h1>Wholesale Storefront</h1>
        {children}
      </div>
    </body></html>
  );
}
