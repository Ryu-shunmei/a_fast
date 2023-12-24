"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Input,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import myAxios from "@/utils/my-axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useBoolean } from "@/hooks/use-boolean";

export default function SiderUsersConf({
  org_id,
  fetchOrgs_,
  setShowRowsData,
  showRowsData,
}) {
  const [outOrgUsers, setOutOrgUsers] = useState([]);
  const [inOrgUsers, setInOrgUsers] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [editOrgID, setEditOrgID] = useState(null);
  const [permissionTypes, setPermissionTypes] = useState([]);
  const [disabledKeys, setDisabledKeys] = useState([]);

  const newUser = useBoolean();
  const newUserSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
  });

  const newUserDefaultValues = {
    name: "",
    email: "",
  };
  const newUserFormik = useFormik({
    initialValues: newUserDefaultValues,
    validationSchema: newUserSchema,
    onSubmit: async (data) => {
      try {
        const response = await myAxios.post("/user", data);
        console.log("new user", response.data);
        await fetchOutOrgUsers();
        newUserFormik.resetForm();
        newUser.onFalse();
      } catch (error) {
        console.log("new user", error);
        alert(error);
      }
    },
  });
  const fetchInOrgUsers = useCallback(async () => {
    if (org_id === "new") {
      return;
    }
    try {
      const res = await myAxios.get(`/org/in/users?org_id=${org_id}`);
      console.log("fetchInOrgUsers", res.data);
      setInOrgUsers(res.data);
    } catch (error) {
      console.log("fetchInOrgUsers", error);
      alert(error);
    }
  }, []);

  const fetchOutOrgUsers = useCallback(async () => {
    try {
      const res = await myAxios.get(`/org/out/users?org_id=${org_id}`);
      setOutOrgUsers(res.data);
    } catch (error) {
      console.log("fetchOutOrgUsers", error);
      alert(error);
    }
  }, []);
  const fetchRoleTypes = useCallback(async () => {
    try {
      const response = await myAxios.get(`/role_types`);
      setRoleTypes(response.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  const fetchPermissionTypes = useCallback(async () => {
    try {
      const response = await myAxios.get(`/permission_types`);
      setPermissionTypes(response.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  const NewOrgUserSchema = Yup.object().shape({
    id: Yup.string(),
    email: Yup.string(),
    name: Yup.string(),
    role_id: Yup.string(),
    role_type: Yup.string(),
    permission_codes: Yup.array(),
  });

  const newOrgUserDefaultValues = {
    id: "",
    email: "",
    name: "",
    role_id: "",
    role_type: "",
    permission_codes: [],
  };
  const newOrgUserformik = useFormik({
    initialValues: newOrgUserDefaultValues,
    validationSchema: NewOrgUserSchema,
    onSubmit: async (data) => {
      console.log(data);
      try {
        if (editOrgID === null || editOrgID === "new") {
          await myAxios.post(`/org/user?org_id=${org_id}`, data);
          newOrgUserformik.resetForm();
        } else {
          await myAxios.put(`/org/user`, data);
          newOrgUserformik.resetForm();
        }
        await fetchInOrgUsers();
        setEditOrgID(null);
        const org = await fetchOrgs_(org_id);
        const tempShowRowsData = JSON.parse(JSON.stringify(showRowsData));
        const targetIndex = showRowsData.findIndex(
          (item) => item.id === org_id
        );
        tempShowRowsData[targetIndex] = org;
        setShowRowsData(tempShowRowsData);
      } catch (error) {
        console.log("new user dailog", error);
      }
    },
  });

  const handleInsert = () => {
    const tempInOrgUsers = JSON.parse(JSON.stringify(inOrgUsers));
    tempInOrgUsers.unshift({
      id: "new",
      email: "",
      name: "",
      role_id: "",
      role_type: "",
      permission_codes: [],
    });
    setInOrgUsers(tempInOrgUsers);
    newOrgUserformik.setFieldValue("id", "");
    newOrgUserformik.setFieldValue("email", "");
    newOrgUserformik.setFieldValue("name", "");
    newOrgUserformik.setFieldValue("role_id", "");
    newOrgUserformik.setFieldValue("role_type", "");
    newOrgUserformik.setFieldValue("permission_codes", []);
    setEditOrgID("new");
  };

  const handleUnInsert = () => {
    const tempInOrgUsers = JSON.parse(JSON.stringify(inOrgUsers));
    tempInOrgUsers.shift();
    setInOrgUsers(tempInOrgUsers);
    setEditOrgID(null);
    newOrgUserformik.resetForm(newOrgUserDefaultValues);
  };

  const handleEdit = (user) => {
    newOrgUserformik.setFieldValue("id", user.id);
    newOrgUserformik.setFieldValue("email", user.email);
    newOrgUserformik.setFieldValue("name", user.name);
    newOrgUserformik.setFieldValue("role_id", user.role_id);
    newOrgUserformik.setFieldValue("role_type", user.role_type);
    newOrgUserformik.setFieldValue("permission_codes", user.permission_codes);

    setEditOrgID(user.id);
  };

  const handleUnEdit = () => {
    if (editOrgID === null || editOrgID === "new") {
      handleUnInsert();
    } else {
      setEditOrgID(null);
    }
    newOrgUserformik.resetForm(newOrgUserDefaultValues);
  };

  const handleDelete = async (role_id) => {
    try {
      await myAxios.delete(`/org/user?role_id=${role_id}`);
      await fetchInOrgUsers();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!!editOrgID) {
      const tempDisabledKeys = [];
      inOrgUsers.forEach((item) => {
        if (item.id !== editOrgID) {
          tempDisabledKeys.push(item.id);
        }
      });
      setDisabledKeys(tempDisabledKeys);
    } else {
      setDisabledKeys([]);
    }
  }, [editOrgID]);

  useEffect(() => {
    fetchRoleTypes();
    fetchPermissionTypes();
    fetchOutOrgUsers();
    fetchInOrgUsers();
  }, []);

  return (
    <Fragment>
      <div className="w-full h-[48px] flex flex-row justify-start items-center">
        <Button size="sm" color="secondary" onClick={handleInsert}>
          メンバー追加
        </Button>
      </div>
      <Table
        aria-label="org users"
        color="secondary"
        removeWrapper
        disabledKeys={disabledKeys}
      >
        <TableHeader>
          <TableColumn>ユーザー</TableColumn>
          <TableColumn>ロールタイプ</TableColumn>
          <TableColumn>権限</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {inOrgUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell width={220}>
                {editOrgID === user.id && editOrgID === "new" ? (
                  <div className="flex flex-row justify-end items-center space-x-2">
                    <Select
                      size="sm"
                      color="secondary"
                      variant="flat"
                      aria-label="users"
                      labelPlacement="outside"
                      className="max-w-xs"
                      name="id"
                      value={newOrgUserformik.values.id}
                      onChange={newOrgUserformik.handleChange}
                      selectedKeys={
                        !!newOrgUserformik.values.id &&
                        newOrgUserformik.values.id !== "new"
                          ? [newOrgUserformik.values.id]
                          : []
                      }
                    >
                      {outOrgUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Popover
                      placement="bottom"
                      showArrow
                      offset={10}
                      isOpen={newUser.value}
                      onOpenChange={newUser.setValue}
                    >
                      <PopoverTrigger>
                        <Button size="sm" color="secondary" isIconOnly>
                          <Icon width={16} icon="bi:person-plus" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px]">
                        <div className="px-1 py-3 space-y-4 w-full">
                          <div className="mt-2 flex flex-col gap-2 w-full">
                            <Input
                              size="sm"
                              isRequired
                              name="name"
                              label="姓名"
                              aria-label="name"
                              classNames={{
                                label: "text-black/50",
                                input: [
                                  "bg-transparent",
                                  "text-black/60",
                                  "placeholder:text-default-700/40",
                                ],
                              }}
                              color="secondary"
                              value={newUserFormik.values.name}
                              onChange={newUserFormik.handleChange}
                            />
                            <Input
                              size="sm"
                              isRequired
                              name="email"
                              label="Eメール"
                              aria-label="email"
                              classNames={{
                                label: "text-black/50",
                                input: [
                                  "bg-transparent",
                                  "text-black/60",
                                  "placeholder:text-default-700/40",
                                ],
                              }}
                              color="secondary"
                              value={newUserFormik.values.email}
                              onChange={newUserFormik.handleChange}
                            />
                          </div>
                          <Button
                            fullWidth
                            size="md"
                            color="secondary"
                            onClick={newUserFormik.handleSubmit}
                          >
                            ユーザー登録
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div
                    className={
                      disabledKeys?.includes(user.id)
                        ? "text-secondary-200"
                        : "text-secondary-600"
                    }
                  >
                    {user?.name}
                  </div>
                )}
              </TableCell>
              <TableCell width={150}>
                {editOrgID === user.id ? (
                  <Select
                    size="sm"
                    color="secondary"
                    variant="flat"
                    aria-label="role type"
                    labelPlacement="outside"
                    className="max-w-xs"
                    name="role_type"
                    value={newOrgUserformik.values.role_type}
                    onChange={newOrgUserformik.handleChange}
                    selectedKeys={
                      !!newOrgUserformik.values.role_type
                        ? [newOrgUserformik.values.role_type]
                        : []
                    }
                  >
                    {roleTypes.map((role) => (
                      <SelectItem key={role.code} value={role.code}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div
                    className={
                      disabledKeys?.includes(user.id)
                        ? "text-secondary-200"
                        : "text-secondary-600"
                    }
                  >
                    {
                      roleTypes.find((role) => role.code === user.role_type)
                        ?.name
                    }
                  </div>
                )}
              </TableCell>
              <TableCell width={220}>
                {editOrgID === user.id ? (
                  <Select
                    size="sm"
                    color="secondary"
                    variant="flat"
                    aria-label="permissions"
                    labelPlacement="outside"
                    selectionMode="multiple"
                    className="max-w-[200px]"
                    name="permission_codes"
                    value={newOrgUserformik.values.permission_codes}
                    onSelectionChange={(set) =>
                      newOrgUserformik.setFieldValue(
                        "permission_codes",
                        Array.from(set)
                      )
                    }
                    selectedKeys={newOrgUserformik.values.permission_codes}
                  >
                    {permissionTypes.map((permission) => (
                      <SelectItem key={permission.code} value={permission.code}>
                        {permission.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div className=" w-full flex flex-row flex-wrap justify-start items-start">
                    {user?.permissions?.map((permission) => (
                      <Chip
                        key={permission.code}
                        variant="flat"
                        color="secondary"
                        className=" h-[12px] px-0 text-[9px] m-[1px]"
                      >
                        {permission?.name}
                      </Chip>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell width={60}>
                <div className="flex flex-row justify-end items-center space-x-2">
                  {editOrgID === user.id && (
                    <Button
                      size="sm"
                      color="secondary"
                      isIconOnly
                      onClick={handleUnEdit}
                    >
                      <Icon width={16} icon="bi:x-lg" />
                    </Button>
                  )}
                  {editOrgID === user.id && (
                    <Button
                      size="sm"
                      color="secondary"
                      isIconOnly
                      onClick={newOrgUserformik.handleSubmit}
                    >
                      <Icon width={19} icon="bi:check2" />
                    </Button>
                  )}
                  {editOrgID !== user.id && (
                    <Button
                      size="sm"
                      color="secondary"
                      isIconOnly
                      isDisabled={disabledKeys.includes(user.id)}
                      onClick={() => handleEdit(user)}
                    >
                      <Icon width={16} icon="bi:pencil" />
                    </Button>
                  )}
                  {editOrgID !== user.id && (
                    <Button
                      size="sm"
                      color="secondary"
                      isIconOnly
                      isDisabled={disabledKeys.includes(user.id)}
                      onClick={() => handleDelete(user.role_id)}
                    >
                      <Icon width={19} icon="bi:trash3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}
