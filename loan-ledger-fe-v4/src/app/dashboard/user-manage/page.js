"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  SelectItem,
  Chip,
} from "@nextui-org/react";

import myAxios from "@/utils/my-axios";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [permissionTypes, setPermissionTypes] = useState([]);
  const [accessOrgs, setAccessOrgs] = useState([]);
  const [editUserID, setEditUserID] = useState(null);
  const [disabledKeys, setDisabledKeys] = useState([]);
  const userSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string(),
    email: Yup.string(),
    role_type: Yup.string(),
    org_id: Yup.string(),
    permission_codes: Yup.array(),
  });

  const userDefaultValues = {
    id: "",
    name: "",
    email: "",
    role_type: "",
    org_id: "",
    permission_codes: [],
  };
  const userFormik = useFormik({
    initialValues: userDefaultValues,
    validationSchema: userSchema,
    onSubmit: async (data) => {
      console.log(data);
      try {
        if (editUserID === null || editUserID === "new") {
          await myAxios.post(`/user`, data);
          userFormik.resetForm();
        } else {
          await myAxios.put(`/user`, data);
          userFormik.resetForm();
        }
        await fetchUsers();
        setEditUserID(null);
      } catch (error) {
        alert(error);
      }
    },
  });

  const fetchAccessOrgs = useCallback(async () => {
    try {
      const res = await myAxios.get(
        `/options/orgs?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.default_role_id
        }`
      );
      console.log("fetchAccessOrgs", res.data);
      setAccessOrgs(res.data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await myAxios.get(
        `/users?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.default_role_id
        }`
      );
      console.log("fetchUsers", res.data);
      setUsers(res.data);
    } catch (error) {
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

  const handleInsert = () => {
    const tempUsers = JSON.parse(JSON.stringify(users));
    tempUsers.unshift({
      id: "new",
      name: "",
      email: "",
      role_type: "",
      org_id: "",
      permission_codes: [],
    });
    setUsers(tempUsers);
    userFormik.setFieldValue("id", "");
    userFormik.setFieldValue("name", "");
    userFormik.setFieldValue("email", "");
    userFormik.setFieldValue("role_type", "");
    userFormik.setFieldValue("org_id", "");
    userFormik.setFieldValue("permission_codes", []);
    setEditUserID("new");
  };

  const handleUnInsert = () => {
    const tempUsers = JSON.parse(JSON.stringify(users));
    tempUsers.shift();
    setUsers(tempUsers);
    setEditUserID(null);
  };

  const handleEdit = (user) => {
    userFormik.setFieldValue("id", user.id);
    userFormik.setFieldValue("name", user.name);
    userFormik.setFieldValue("email", user.email);
    userFormik.setFieldValue("role_type", "");
    userFormik.setFieldValue("org_id", "");
    userFormik.setFieldValue("permission_codes", []);
    setEditUserID(user.id);
  };

  const handleUnEdit = () => {
    if (editUserID === null || editUserID === "new") {
      handleUnInsert();
    } else {
      setEditUserID(null);
    }
    userFormik.resetForm(userDefaultValues);
  };

  useEffect(() => {
    if (!!editUserID) {
      const tempDisabledKeys = [];
      users.forEach((item) => {
        if (item.id !== editUserID) {
          tempDisabledKeys.push(item.id);
        }
      });
      setDisabledKeys(tempDisabledKeys);
    } else {
      setDisabledKeys([]);
    }
  }, [editUserID]);

  useEffect(() => {
    //
    fetchAccessOrgs();
    fetchRoleTypes();
    fetchPermissionTypes();
    fetchUsers();
  }, []);
  return (
    <Fragment>
      <div className="h-[48px] px-[16px] w-full flex flex-row justify-between items-center">
        <div className="text-[18px] text-secondary-600 font-medium">
          ユーザー管理
        </div>
        <Button size="sm" color="secondary" onClick={handleInsert}>
          ユーザー新規
        </Button>
      </div>
      <div className="h-full min-h-[calc(100vh_-_112px)] px-[8px]">
        <Table
          aria-label="org users"
          color="secondary"
          removeWrapper
          disabledKeys={disabledKeys}
        >
          <TableHeader>
            <TableColumn>ユーザー名</TableColumn>
            <TableColumn>Eメール</TableColumn>
            <TableColumn>所属ロール</TableColumn>
            <TableColumn>{!!editUserID ? "新規ロール組織" : ""}</TableColumn>
            <TableColumn>{!!editUserID ? "新規ロールタイプ" : ""}</TableColumn>
            <TableColumn>{!!editUserID ? "新規ロール権限" : ""}</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell width={130}>
                  {editUserID === user.id ? (
                    <Input
                      className="max-w-xs"
                      aria-label="name"
                      size="sm"
                      labelPlacement="outside"
                      color="secondary"
                      name="name"
                      value={userFormik.values.name}
                      onChange={userFormik.handleChange}
                    />
                  ) : (
                    <div
                      className={
                        disabledKeys?.includes(user.id)
                          ? "text-secondary-200"
                          : "text-secondary-600"
                      }
                    >
                      {user.name}
                    </div>
                  )}
                </TableCell>
                <TableCell width={200}>
                  {editUserID === user.id ? (
                    <Input
                      className="max-w-xs"
                      aria-label="name"
                      size="sm"
                      labelPlacement="outside"
                      color="secondary"
                      name="email"
                      value={userFormik.values.email}
                      onChange={userFormik.handleChange}
                    />
                  ) : (
                    <div
                      className={
                        disabledKeys?.includes(user.id)
                          ? "text-secondary-200"
                          : "text-secondary-600"
                      }
                    >
                      {user.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {user.id === "new" ? (
                    <div className="text-secondary-200">ーー</div>
                  ) : (
                    <div className=" max-w-[30vw] flex flex-row flex-wrap justify-start items-start">
                      {user?.roles?.map((item, index) => (
                        <Chip
                          key={index}
                          variant="flat"
                          color="secondary"
                          isDisabled={
                            disabledKeys.includes(user.id) ||
                            editUserID === user.id
                          }
                          className=" h-[14px] px-0 text-[9px] m-[1px]"
                        >
                          {`${item.org_name}:${
                            roleTypes.find((i) => i.code === item.role_type)
                              ?.name
                          }`}
                        </Chip>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell width={!!editUserID ? 200 : 10}>
                  {editUserID === user.id && (
                    <Select
                      className="max-w-xs"
                      aria-label="type"
                      size="sm"
                      labelPlacement="outside"
                      color="secondary"
                      name="org_id"
                      onChange={userFormik.handleChange}
                      selectedKeys={
                        !!userFormik.values.org_id
                          ? [userFormik.values.org_id]
                          : []
                      }
                    >
                      {accessOrgs.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </TableCell>
                <TableCell width={!!editUserID ? 150 : 10}>
                  {editUserID === user.id && (
                    <Select
                      size="sm"
                      color="secondary"
                      variant="flat"
                      aria-label="role type"
                      labelPlacement="outside"
                      className="max-w-xs"
                      name="role_type"
                      value={userFormik.values.role_type}
                      onChange={userFormik.handleChange}
                      selectedKeys={
                        !!userFormik.values.role_type
                          ? [userFormik.values.role_type]
                          : []
                      }
                    >
                      {roleTypes.map((role) => (
                        <SelectItem key={role.code} value={role.code}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </TableCell>
                <TableCell width={!!editUserID ? 220 : 10}>
                  {editUserID === user.id && (
                    <Select
                      size="sm"
                      color="secondary"
                      variant="flat"
                      aria-label="permissions"
                      labelPlacement="outside"
                      selectionMode="multiple"
                      className="max-w-[200px]"
                      name="permission_codes"
                      value={userFormik.values.permission_codes}
                      onSelectionChange={(set) =>
                        userFormik.setFieldValue(
                          "permission_codes",
                          Array.from(set)
                        )
                      }
                      selectedKeys={userFormik.values.permission_codes}
                    >
                      {permissionTypes.map((permission) => (
                        <SelectItem
                          key={permission.code}
                          value={permission.code}
                        >
                          {permission.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row justify-end items-center space-x-2">
                    {editUserID === user.id && (
                      <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        onClick={handleUnEdit}
                      >
                        <Icon width={16} icon="bi:x-lg" />
                      </Button>
                    )}
                    {editUserID === user.id && (
                      <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        onClick={userFormik.handleSubmit}
                      >
                        <Icon width={19} icon="bi:check2" />
                      </Button>
                    )}
                    {editUserID !== user.id && (
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}
