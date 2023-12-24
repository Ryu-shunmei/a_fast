import { NextUIProvider as Provider } from "@nextui-org/react";

export default function NextUIProvider({ children }) {
  return <Provider>{children}</Provider>;
}
