// import Image from "next/image";
import { NavItem } from "@/components/nav-item";
import { NavUser } from "@/components/nav-user";
import CustzBreadcrumbs from "@/components/breadcumbs";

export default function DashboardLayout({ children }) {
  return (
    <main className="w-full h-full">
      <header className="z-40 w-full h-[64px] fixed flex flex-row justify-start items-center pl-[80px] bg-white">
        <CustzBreadcrumbs />
      </header>
      <nav className="z-50 fixed w-[64px] min-h-[100vh] shadow-md flex flex-col justify-between pb-4">
        <div className="w-full h-[64px] flex justify-center items-center">
          <img
            width={26}
            height={26}
            alt="logo-mini"
            src="/logos/logo-mini.svg"
          />
        </div>
        <div className="w-[64px] flex flex-col flex-1 justify-start items-center space-y-4">
          {navConfig.map((nav) => (
            <NavItem
              key={nav.id}
              icon={nav.icon}
              lable={nav.lable}
              path={nav.path}
            />
          ))}
        </div>
        <div className="flex flex-col justify-center items-center">
          <NavUser user_name="1" user_email="s" />
        </div>
      </nav>
      <section className=" pt-[64px] pl-[64px]">{children}</section>
    </main>
  );
}

// 菜单配置
const navConfig = [
  //
  {
    id: 1,
    lable: "案件管理",
    icon: "bi:database",
    path: "/dashboard/case-manage",
    accessCode: "CASE_01",
  },
  {
    id: 2,
    lable: "社員管理",
    path: "/dashboard/user-manage",
    icon: "bi:people",
    accessCode: "USER_01",
  },
  {
    id: 3,
    lable: "組織管理",
    path: "/dashboard/org-manage",
    icon: "bi:diagram-3",
    accessCode: "ORG_01",
  },
  {
    id: 4,
    lable: "銀行管理",
    path: "/dashboard/bank-manage",
    icon: "bi:bank",
    accessCode: "ORG_01",
    accessCode: "BANK_01",
  },
];
