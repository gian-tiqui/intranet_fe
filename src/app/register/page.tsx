import React, { use } from "react";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = use(params);

  return <RegisterForm hashedMmployeeId={+param.id} />;
};

export default RegisterPage;
