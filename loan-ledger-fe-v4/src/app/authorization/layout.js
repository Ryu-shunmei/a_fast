export default function AuthLayout({ children }) {
  return (
    <div className="container mx-auto min-h-[100vh] flex flex-col justify-between items-center">
      <header></header>
      {children}
      <footer className=" text-[12px]">Copyright © 2023 MILIZE Inc.</footer>
    </div>
  );
}
