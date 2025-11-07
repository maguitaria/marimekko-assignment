// app/head.tsx
export default function Head() {
  return (
    <>
      <title>Marimekko Wholesale Portal</title>
      <meta
        name="description"
        content="Official B2B platform for Marimekko wholesale clients."
      />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta property="og:title" content="Marimekko Wholesale Portal" />
      <meta
        property="og:description"
        content="Manage your wholesale catalog, stock, and pricing."
      />
      <meta property="og:image" content="/logo.png" />
    </>
  );
}
