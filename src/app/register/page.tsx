import React from "react";
import RegisterForm from "./components/RegisterForm";
import { use } from "react";

const RegisterPage = ({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) => {
  const params = use(searchParams);

  return <RegisterForm hashedMmployeeId={params.id} />;
};

export default RegisterPage;
