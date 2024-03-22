import { Form } from "@remix-run/react";

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  method: "post" | "get" | "put" | "delete";
  action?: string;
};

export default function BasicForm({
  onSubmit,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <Form
      onSubmit={onSubmit}
      className={``.concat(className).trim()}
      {...props}
    >
      {children}
    </Form>
  );
}
