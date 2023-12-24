"use client";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { usePathname, useRouter } from "next/navigation";

export function NavItem({ icon, lable, path }) {
  const router = useRouter();
  const curr_path = usePathname();
  return (
    <Tooltip
      content={
        <div className="px-1 py-1">
          <div className="text-small text-secondary-500">{lable}</div>
        </div>
      }
      placement="right"
    >
      <Button
        isIconOnly
        variant={curr_path.includes(path) ? "flat" : "light"}
        color={curr_path.includes(path) ? "secondary" : "default"}
        onClick={() => router.push(path)}
      >
        <Icon
          width={24}
          icon={icon}
          className={
            curr_path.includes(path) ? "text-purple-600" : "text-gray-500"
          }
        />
      </Button>
    </Tooltip>
  );
}
