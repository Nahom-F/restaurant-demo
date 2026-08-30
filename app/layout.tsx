import "./globals.css";

export const metadata = {
  title: "The Cafe",
  description: "A restaurant/cafe demo site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
