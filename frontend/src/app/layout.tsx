import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbnb Clone | Holiday rentals, cabins, beach houses & more",
  description: "Get an Airbnb clone for every kind of trip.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-is-hyperloop="true" data-is-async-local-storage="true" className="scrollbar-gutter dir native vz2oe5x vyb6402">
      <head>
        <link rel="stylesheet" href="https://a0.muscache.com/airbnb/static/packages/web/common/frontend/core-guest-spa/entrypoints/client.2692723724.css" type="text/css" crossOrigin="anonymous" media="all" data-linaria-css-swap="true" />
      </head>
      <body className="min-h-full flex flex-col with-new-header">{children}</body>
    </html>
  );
}
