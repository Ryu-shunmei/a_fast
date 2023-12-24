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
  Card,
  Checkbox,
} from "@nextui-org/react";

import myAxios from "@/utils/my-axios";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import useTable from "@/hooks/use-table";

// ----------------------------------------------------------------------
const defaultFilters = {
  name: "",
};

export default function Page() {
  const [users, setUsers] = useState([]);
  const [accessOrgs, setAccessOrgs] = useState([]);
  const [editCaseID, setEditCaseID] = useState(null);
  const [disabledKeys, setDisabledKeys] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [cases, setCases] = useState([]);
  const table = useTable();

  const handleFilters = () => {};

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

  const schema = Yup.object().shape({
    id: Yup.string(),
    org_id: Yup.string().required(),
    user_id: Yup.string().required(),
    exe_confirm: Yup.string(),
    shbs_report: Yup.string(),
    bank_id: Yup.string(),
    loan_target: Yup.string(),
    ap_loan_applicable: Yup.string(),
    exe_date: Yup.string(),
    house_code: Yup.string(),
    house_name: Yup.string(),
    loan_amount: Yup.string(),
    deposit_amount: Yup.string(),
    heim_note: Yup.string(),
    shbs_note: Yup.string(),
    shbs_confirm: Yup.string(),
    collection_date: Yup.string(),
    receive_date: Yup.string(),
    registrate_date: Yup.string(),
    schedule_date: Yup.string(),
    establish_date: Yup.string(),
    doc_send_date: Yup.string(),
    confirm_date: Yup.string(),
  });

  const defaultValues = {
    id: "",
    org_id: "",
    user_id: "",
    exe_confirm: "",
    shbs_report: "",
    bank_id: "",
    loan_target: "",
    ap_loan_applicable: "",
    exe_date: "",
    house_code: "",
    house_name: "",
    loan_amount: "",
    deposit_amount: "",
    heim_note: "",
    shbs_note: "",
    shbs_confirm: "",
    collection_date: "",
    receive_date: "",
    registrate_date: "",
    schedule_date: "",
    establish_date: "",
    doc_send_date: "",
    confirm_date: "",
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      console.log(data);
      try {
        await myAxios.post("/case", data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleInsert = () => {
    const tempCases = JSON.parse(JSON.stringify(cases));
    tempCases.unshift({
      id: "new",
      org_id: "",
      user_id: "",
      exe_confirm: "",
      shbs_report: "",
      bank_id: "",
      loan_target: "",
      ap_loan_applicable: "",
      exe_date: "",
      house_code: "",
      house_name: "",
      loan_amount: "",
      deposit_amount: "",
      heim_note: "",
      shbs_note: "",
      shbs_confirm: "",
      collection_date: "",
      receive_date: "",
      registrate_date: "",
      schedule_date: "",
      establish_date: "",
      doc_send_date: "",
      confirm_date: "",
    });
    setCases(tempCases);
    formik.setFieldValue("id", "");
    setEditCaseID("new");
  };

  const handleUnInsert = () => {};

  const handleEdit = (user) => {};

  const handleUnEdit = () => {};

  useEffect(() => {
    if (!!editCaseID) {
      const tempDisabledKeys = [];
      cases.forEach((item) => {
        if (item.id !== editCaseID) {
          tempDisabledKeys.push(item.id);
        }
      });
      setDisabledKeys(tempDisabledKeys);
    } else {
      setDisabledKeys([]);
    }
  }, [editCaseID]);

  useEffect(() => {
    //
    // fetchAccessOrgs();
    // fetchRoleTypes();
    // fetchPermissionTypes();
    // fetchUsers();
  }, []);
  return (
    <Fragment>
      <div className="h-[48px] px-[16px] w-full flex flex-row justify-between items-center">
        <div className="text-[18px] text-secondary-600 font-medium">
          案件管理
        </div>
      </div>
      <div className="h-[48px] px-[16px] w-full flex flex-row justify-between items-center">
        <Input
          size="sm"
          color="secondary"
          isClearable={true}
          onClear={() => {}}
          labelPlacement="outline"
          placeholder="邸名で検索します"
          startContent={
            <Icon width={14} className="mb-0.5 " icon="bi:search" />
          }
          className="max-w-xs"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          onChange={(e) => handleFilters("name", e.target.value)}
        />
        <Button size="sm" color="secondary" onClick={handleInsert}>
          案件新規
        </Button>
      </div>
      <div className="h-full min-h-[calc(100vh_-_160px)] px-[8px]">
        <Table
          aria-label="org users"
          color="secondary"
          removeWrapper
          disabledKeys={disabledKeys}
        >
          <TableHeader>
            <TableColumn>担当者情報</TableColumn>
            <TableColumn>確認情報</TableColumn>
            <TableColumn>ローン情報</TableColumn>
            <TableColumn>抵当権設定</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {cases.map((row) => (
              <TableRow>
                <TableCell className="align-top">
                  <div className="flex flex-col justify-start items-start space-y-1">
                    <Select
                      size="sm"
                      color={!!editCaseID ? "secondary" : "default"}
                      readOnly={!editCaseID}
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-[9px] min-w-[30px]">
                            支店名:
                          </span>
                        </div>
                      }
                    >
                      {accessOrgs.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      size="sm"
                      color={!!editCaseID ? "secondary" : "default"}
                      readOnly={!editCaseID}
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-[9px] min-w-[30px]">
                            支店名
                          </span>
                        </div>
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-col justify-start items-start space-y-1">
                    <div>
                      <Checkbox
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                      >
                        実行確定
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                      >
                        実行確定
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                      >
                        実行確定
                      </Checkbox>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-col justify-start items-start space-y-1">
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-col justify-start items-start space-y-1">
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center space-x-1">
                      <Input
                        type="date"
                        size="sm"
                        color={!!editCaseID ? "secondary" : "default"}
                        readOnly={!editCaseID}
                        labelPlacement="outside"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-[9px] min-w-[30px]">
                              支店名
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex flex-row justify-end items-center space-x-2">
                    {editCaseID === row.id && (
                      <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        onClick={handleUnEdit}
                      >
                        <Icon width={16} icon="bi:x-lg" />
                      </Button>
                    )}
                    {editCaseID === row.id && (
                      <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        onClick={formik.handleSubmit}
                      >
                        <Icon width={19} icon="bi:check2" />
                      </Button>
                    )}
                    {editCaseID !== row.id && (
                      <Button
                        size="sm"
                        color="secondary"
                        isIconOnly
                        isDisabled={disabledKeys.includes(bank.id)}
                        onClick={() => handleEdit(bank)}
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
