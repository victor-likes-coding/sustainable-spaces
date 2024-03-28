import { Form } from "@remix-run/react";
import { ReactNode } from "react";

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  method: "post" | "get" | "put" | "delete";
  action?: string;
};

export default function BasicForm({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <Form className={``.concat(className).trim()} {...props}>
      {children}
    </Form>
  );
}
