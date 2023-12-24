"use client";
import { Icon } from "@iconify/react";
import myAxios from "@/utils/my-axios";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useCallback, useEffect, useState } from "react";

export function NavUser() {
  const { user, switch_role, logout } = useAuthContext();
  const [roleTypes, setRoleTypes] = useState([]);
  const fetchRoleTypes = useCallback(async () => {
    try {
      const response = await myAxios.get(`/role_types`);
      setRoleTypes(response.data);
    } catch (error) {
      console.error("fetchOrgs", error);
      alert(error);
    }
  }, []);

  useEffect(() => {
    fetchRoleTypes();
  }, []);
  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          radius="sm"
          className="w-[32px] h-[32px]"
          color="secondary"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        />
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="user">
        <DropdownSection title="ユーザー" showDivider>
          <DropdownItem key="userInfo" description={user?.email}>
            {user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="ロール切替" showDivider>
          {user?.roles.map((role) => (
            <DropdownItem
              key={role.id}
              onClick={() => switch_role(user?.id, role?.id)}
              endContent={
                role?.id === user?.fefault_role_id ? (
                  <Icon icon="carbon:checkmark" />
                ) : (
                  <></>
                )
              }
            >
              {`${role?.org_name}: ${
                roleTypes.find((item) => item.code === role.type)?.name
              }`}
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownItem
          key="logout"
          as={Button}
          endContent={<Icon icon="bi:arrow-bar-right" />}
          className="text-left"
          onClick={logout}
        >
          ログアウト
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
