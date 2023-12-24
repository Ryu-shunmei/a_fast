"use client";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function CustzBreadcrumbs() {
  const pathName = usePathname();
  const configs = pathName.split("?")[0].split("/");
  configs.shift();
  return (
    <Breadcrumbs size="lg" color="secondary">
      {configs.map((item) => (
        <BreadcrumbItem key={item} className="capitalize">
          {item}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
