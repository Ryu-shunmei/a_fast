"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import myAxios from "@/utils/my-axios";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/use-auth-context";
import { jwtDecode } from "jwt-decode";
import { Icon } from "@iconify/react";
import SiderUsersConf from "@/components/sider-users";

export default function Page() {
  const [rowsData, setRowsData] = useState([]);
  const [showRowsData, setShowRowsData] = useState([]);
  const [defaultKeys, setDefaultKeys] = useState([]);
  const [editID, setEditID] = useState(null);
  const [showUsersID, setShowUsersID] = useState(null);
  const [userConfID, setUserConfID] = useState(null);
  const [showChildrenParentID, setShowChildrenParentID] = useState([null]);
  const [orgTypes, setOrgTypes] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);

  const fetchOrgs = useCallback(async () => {
    try {
      const res = await myAxios.get(
        `/orgs?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.default_role_id
        }`
      );
      console.log(res.data);
      const tempRowsData = [];
      const mapTreeData = (treeData, tempRowsData) => {
        treeData.forEach((node, index) => {
          tempRowsData.push({
            id: node.id,
            key: node.key,
            parent_id: node.parent_id,
            name: node.name,
            type: node.type,
            depth: node.depth,
            users: node.users,
            ancestor: node.ancestor,
            hashChildren: !!node?.children,
            isInsert: false,
          });
          if (!!node?.children) {
            mapTreeData(node.children, tempRowsData);
          }
        });
      };
      mapTreeData(res.data, tempRowsData);
      setRowsData(tempRowsData);
      const tempShowRowsData = tempRowsData.filter((item) =>
        showChildrenParentID.includes(item.parent_id)
      );
      setShowRowsData(tempShowRowsData);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, []);

  const fetchOrgs_ = useCallback(async (id) => {
    try {
      const res = await myAxios.get(
        `/orgs?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.default_role_id
        }`
      );
      console.log(res.data);
      const tempRowsData = [];
      const mapTreeData = (treeData, tempRowsData) => {
        treeData.forEach((node, index) => {
          tempRowsData.push({
            id: node.id,
            key: node.key,
            parent_id: node.parent_id,
            name: node.name,
            type: node.type,
            depth: node.depth,
            users: node.users,
            ancestor: node.ancestor,
            hashChildren: !!node?.children,
            isInsert: false,
          });
          if (!!node?.children) {
            mapTreeData(node.children, tempRowsData);
          }
        });
      };
      mapTreeData(res.data, tempRowsData);
      setRowsData(tempRowsData);
      return tempRowsData.find((item) => item.id == id);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    id: Yup.string(),
    parent_id: Yup.string().nullable(),
    name: Yup.string(),
    type: Yup.string(),
    users: Yup.array(),
  });

  const defaultValues = {
    id: "",
    parent_id: "",
    name: "",
    type: "",
    users: [],
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: LoginSchema,
    onSubmit: async (data) => {
      console.log(data);
      try {
        if (!data.id) {
          const res = await myAxios.post("/org", data);
          console.log("new org", res.data);
          const org = await fetchOrgs_(res.data.id);
          const tempShowRowsData = JSON.parse(JSON.stringify(showRowsData));
          const targetIndex = showRowsData.findIndex(
            (item) => item.id === "new"
          );
          tempShowRowsData[targetIndex] = org;
          setShowRowsData(tempShowRowsData);
          setEditID(null);

          formik.resetForm();
        } else {
          const res = await myAxios.put(`/org?id=${data.id}`, data);
          console.log("edit org", res.data);
          const org = await fetchOrgs_(res.data.id);
          const tempShowRowsData = JSON.parse(JSON.stringify(showRowsData));
          const targetIndex = showRowsData.findIndex(
            (item) => item.id === res.data.id
          );
          tempShowRowsData[targetIndex] = org;
          setShowRowsData(tempShowRowsData);
          setEditID(null);
          formik.resetForm();
        }
      } catch (error) {
        console.log("new user dailog", error);
      }
    },
  });

  const fetchOrgTypes = useCallback(async () => {
    try {
      const response = await myAxios.get(`/org_types`);
      setOrgTypes(response.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  const fetchRoleTypes = useCallback(async () => {
    try {
      const response = await myAxios.get(`/role_types`);
      setRoleTypes(response.data);
      console.log("role types", response.data);
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleInsert = (index, parent_id, depth) => {
    const tempShowChildrenParentID = JSON.parse(
      JSON.stringify(showChildrenParentID)
    );
    let tempRowsData = [];
    if (!showChildrenParentID.includes(parent_id)) {
      tempShowChildrenParentID.push(parent_id);
      setShowChildrenParentID(tempShowChildrenParentID);
      tempRowsData = rowsData.filter((item) =>
        tempShowChildrenParentID.includes(item.parent_id)
      );
      setShowRowsData(tempRowsData);
    } else {
      tempRowsData = [...showRowsData];
    }
    tempRowsData.splice(index, 0, {
      id: "new",
      key: "",
      parent_id: parent_id,
      depth: depth,
      name: "",
      type: "",
      manager_id: "",
      manager_name: "",
      users: [],
      hashChildren: false,
      isInsert: true,
    });
    formik.setFieldValue("id", "");
    formik.setFieldValue("parent_id", parent_id);
    formik.setFieldValue("name", "");
    formik.setFieldValue("type", "");
    formik.setFieldValue("users", []);
    setEditID("new");
    setShowRowsData(tempRowsData);
  };

  const handleUnInsert = (index) => {
    const tempRowsData = JSON.parse(JSON.stringify(showRowsData));
    tempRowsData.splice(index, 1);
    formik.resetForm(defaultValues);
    setEditID(null);
    setShowRowsData(tempRowsData);
  };

  const handleEdit = (row) => {
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("parent_id", row.parent_id);
    formik.setFieldValue("name", row.name);
    formik.setFieldValue("type", row.type);
    formik.setFieldValue("users", row.users);
    setEditID(row.id);
  };

  const handleUnEdit = (index) => {
    if (editID === null || editID === "new") {
      handleUnInsert(index);
    } else {
      setEditID(null);
    }
    formik.resetForm(defaultValues);
  };

  const handleShowChildren = (id) => {
    const tempShowChildrenParentID = JSON.parse(
      JSON.stringify(showChildrenParentID)
    );
    if (showChildrenParentID.includes(id)) {
      const removeID = [id];
      rowsData.forEach((item) => {
        if (item.ancestor.includes(id)) {
          removeID.push(item.id);
        }
      });
      const tempShowChildrenParentID_ = showChildrenParentID.filter(
        (parent_id) => !removeID.includes(parent_id)
      );
      setShowChildrenParentID(tempShowChildrenParentID_);
      const tempRowsData = rowsData.filter((item) =>
        tempShowChildrenParentID_.includes(item.parent_id)
      );
      setShowRowsData(tempRowsData);
      return tempRowsData;
    } else {
      tempShowChildrenParentID.push(id);
      setShowChildrenParentID(tempShowChildrenParentID);
      const tempRowsData = rowsData.filter((item) =>
        tempShowChildrenParentID.includes(item.parent_id)
      );
      setShowRowsData(tempRowsData);
      return tempRowsData;
    }
  };

  useEffect(() => {
    if (userConfID || editID) {
      const tempDefaultKeys = [];
      showRowsData.forEach((item) => {
        if (item.id !== userConfID || item.id !== editID) {
          tempDefaultKeys.push(item.id);
        }
      });
      setDefaultKeys(tempDefaultKeys);
    } else {
      setDefaultKeys([]);
    }
  }, [userConfID, editID]);

  useEffect(() => {
    fetchOrgTypes();
    fetchRoleTypes();
    fetchOrgs();
  }, []);

  return (
    <Fragment>
      <div className="h-[48px] pl-[16px] text-[18px] text-secondary-600 font-medium">
        組織管理
      </div>
      <div className="h-full min-h-[calc(100vh_-_112px)] px-[8px] flex flex-row justify-start items-start space-x-4">
        <div className=" flex-1">
          <Table
            aria-label="組織管理"
            removeWrapper
            color="secondary"
            disabledKeys={defaultKeys}
            selectionMode="single"
            selectedKeys={!!userConfID ? [userConfID] : []}
          >
            <TableHeader>
              <TableColumn>組織名称</TableColumn>
              <TableColumn>タイプ</TableColumn>
              <TableColumn>{!!userConfID ? "" : "メンバー"}</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              {showRowsData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="h-full flex flex-col justify-start items-start">
                      <div className="flex flex-row justify-start items-center">
                        {[...new Array(row.depth).keys()].map((i) => (
                          <div key={i} className="min-w-[30px] w-[30px]" />
                        ))}

                        {editID === row.id ? (
                          <Input
                            className="max-w-xs border-secondary-500"
                            aria-label="name"
                            size="sm"
                            labelPlacement="outside"
                            color="secondary"
                            name="name"
                            value={formik.values.name}
                            onChange={(e) => {
                              formik.setFieldValue("name", e.target.value);
                            }}
                          />
                        ) : (
                          <div className="flex flex-row justify-start items-center space-x-[1px]">
                            <Button
                              size="sm"
                              variant="light"
                              color="secondary"
                              isIconOnly
                              isDisabled={
                                !row?.hashChildren ||
                                userConfID === row.id ||
                                defaultKeys?.includes(row.id)
                              }
                              onClick={() => handleShowChildren(row?.id)}
                            >
                              <Icon
                                width={14}
                                icon={
                                  row?.hashChildren
                                    ? showChildrenParentID.includes(row.id)
                                      ? "bi:caret-down-square"
                                      : "bi:caret-right-square"
                                    : "bi:dash-square"
                                }
                              />
                            </Button>

                            <div
                              className={
                                defaultKeys?.includes(row.id)
                                  ? "text-secondary-200"
                                  : "text-secondary-600"
                              }
                            >
                              {row.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editID === row.id ? (
                      <Select
                        className="max-w-xs"
                        aria-label="type"
                        size="sm"
                        labelPlacement="outside"
                        color="secondary"
                        name="type"
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.touched.type && Boolean(formik.errors.type)
                        }
                        errorMessage={formik.touched.type && formik.errors.type}
                        selectedKeys={
                          !!formik.values.type ? [formik.values.type] : []
                        }
                      >
                        {orgTypes.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <div
                        className={
                          defaultKeys?.includes(row.id)
                            ? "text-secondary-200"
                            : "text-secondary-600"
                        }
                      >
                        {orgTypes.find((item) => item.code === row?.type)?.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell width={!userConfID ? "330px" : "10px"}>
                    {!userConfID ? (
                      <div className="flex flex-row justify-start items-start space-x-1">
                        <div className="w-[280px] space-y-1">
                          <Popover
                            placement="bottom"
                            isOpen={showUsersID === row.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setShowUsersID(null);
                              } else {
                                setShowUsersID(row.id);
                              }
                            }}
                          >
                            <PopoverTrigger>
                              <Button
                                size="sm"
                                color="secondary"
                                variant="flat"
                                fullWidth
                                isDisabled={
                                  defaultKeys?.includes(row.id) ||
                                  editID === row.id
                                }
                                endContent={
                                  <Icon
                                    icon={
                                      showUsersID === row.id
                                        ? "bi:chevron-down"
                                        : "bi:chevron-up"
                                    }
                                  />
                                }
                                className=" flex flex-row justify-between items-center px-4"
                              >{`メンバー数: ${row.users.length} 名`}</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Listbox
                                variant="flat"
                                aria-label="users"
                                items={row.users}
                                classNames={{
                                  base: "w-[250px]",
                                }}
                              >
                                {(item) => (
                                  <ListboxItem
                                    key={item.name}
                                    textValue={item.name}
                                  >
                                    <div className="w-full flex flex-row justify-between items-center">
                                      <div className="flex flex-col justify-start items-start">
                                        <div className="text-[12px]">
                                          {item.name}
                                        </div>
                                        <div className="text-[12px] text-default-400">
                                          {item.email}
                                        </div>
                                      </div>
                                      <Chip
                                        size="sm"
                                        color="secondary"
                                        variant="flat"
                                      >
                                        {
                                          roleTypes.find(
                                            (i) => i.code === item?.type
                                          )?.name
                                        }
                                      </Chip>
                                    </div>
                                  </ListboxItem>
                                )}
                              </Listbox>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          size="sm"
                          color="secondary"
                          isIconOnly
                          isDisabled={
                            editID === row.id || defaultKeys?.includes(row.id)
                          }
                          onClick={() => {
                            if (userConfID === row.id) {
                              setUserConfID(null);
                            } else {
                              setUserConfID(row.id);
                            }
                          }}
                        >
                          <Icon width={16} icon="bi:sliders" />
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell width="100px">
                    <div className="flex flex-row justify-end items-center space-x-2">
                      {editID !== row.id && (
                        <Button
                          size="sm"
                          color="secondary"
                          isIconOnly
                          isDisabled={
                            userConfID === row.id ||
                            defaultKeys?.includes(row.id)
                          }
                          onClick={() => handleEdit(row)}
                        >
                          <Icon width={16} icon="bi:pencil" />
                        </Button>
                      )}
                      {editID !== row.id && (
                        <Button
                          size="sm"
                          color="secondary"
                          isIconOnly
                          isDisabled={
                            userConfID === row.id ||
                            defaultKeys?.includes(row.id)
                          }
                          onClick={() =>
                            handleInsert(index + 1, row.id, row.depth + 1)
                          }
                        >
                          <Icon width={16} icon="bi:arrow-return-left" />
                        </Button>
                      )}
                      {editID === row.id && (
                        <Button
                          size="sm"
                          color="secondary"
                          isIconOnly
                          onClick={() => handleUnEdit(index)}
                        >
                          <Icon width={16} icon="bi:x-lg" />
                        </Button>
                      )}
                      {editID === row.id && (
                        <Button
                          size="sm"
                          color="secondary"
                          isIconOnly
                          onClick={formik.handleSubmit}
                        >
                          <Icon width={19} icon="bi:check2" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!!userConfID && (
          <div className="h-full min-h-[calc(100vh_-_112px)]  border-[0.5px] border-solid border-[#D4D4D8]"></div>
        )}

        {!!userConfID && (
          <div className="w-[46vw] h-full">
            <Table aria-label="ユーザー追加" removeWrapper>
              <TableHeader>
                <TableColumn>
                  <div className="flex flex-row justify-between items-center">
                    <div className="text-[18px] text-secondary-500 text-medium">
                      {`${
                        showRowsData.find((item) => item.id === userConfID).name
                      } メンバー管理`}
                    </div>
                    <Button
                      size="sm"
                      color="secondary"
                      isIconOnly
                      onClick={() => {
                        setUserConfID(null);
                      }}
                    >
                      <Icon width={16} icon="bi:x-lg" />
                    </Button>
                  </div>
                </TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell className="p-0">
                    <SiderUsersConf
                      org_id={
                        !!editID ? editID : !!userConfID ? userConfID : ""
                      }
                      fetchOrgs_={fetchOrgs_}
                      showRowsData={showRowsData}
                      setShowRowsData={setShowRowsData}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Fragment>
  );
}
