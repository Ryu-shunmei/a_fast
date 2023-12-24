"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button, Card, Image, Input } from "@nextui-org/react";
// hooks
import { useBoolean } from "@/hooks/use-boolean";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function Page() {
  const router = useRouter();
  const showPwd = useBoolean();
  const { login } = useAuthContext();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: LoginSchema,
    onSubmit: async (data) => {
      try {
        await login(data.email, data.password);
        router.push("/dashboard/org-manage");
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <Card
      isBlurred
      shadow="sm"
      className="border-none bg-background/60 w-[400px] flex flex-col justify-start items-center space-y-6 pt-4 px-4 pb-16"
    >
      <Image
        width={38}
        alt="Logo Image"
        radius="none"
        src="/logos/logo-mini.svg"
      />
      <div className="w-full text-center">
        <h2 className=" prose prose-stone text-[24px] text-secondary-600">
          ようこそ
        </h2>
        <h6 className="prose text-[12px] text-secondary-300">
          続行するには資格情報を入力してください
        </h6>
      </div>

      <div className=" w-full space-y-4">
        <Input
          isRequired
          type="email"
          name="email"
          label="Eメール"
          placeholder="Eメールを入力してください"
          classNames={{
            label: "text-black/50",
            input: [
              "bg-transparent",
              "text-black/60",
              "placeholder:text-default-700/40",
            ],
          }}
          color="secondary"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Input
          isRequired
          name="password"
          label="パスワード"
          placeholder="パスワードを入力してください"
          classNames={{
            label: "text-black/50",
            input: [
              "bg-transparent",
              "text-black/60",
              "placeholder:text-default-700/40",
            ],
          }}
          color="secondary"
          endContent={
            <Icon
              icon={showPwd.value ? "carbon:view" : "carbon:view-off"}
              onClick={showPwd.onToggle}
              className="cursor-pointer"
            />
          }
          type={showPwd.value ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <Button
        fullWidth
        size="lg"
        color="secondary"
        isLoading={false}
        onClick={formik.handleSubmit}
      >
        ログイン
      </Button>
    </Card>
  );
}
