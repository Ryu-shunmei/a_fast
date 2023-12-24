"use client";
// style
import "@/styles/globals.css";
// prociders
import NextUIProvider from "@/prociders/nextui-provider";
import AuthProvider from "@/prociders/auth-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NextUIProvider>{children}</NextUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
