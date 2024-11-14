import React from "react";
import RegisterForm from "./components/RegisterForm";

interface Props {
  searchParams: {
    id: number;
  };
}

const RegisterPage: React.FC<Props> = ({ searchParams }) => {
  return <RegisterForm hashedMmployeeId={searchParams.id} />;
};

export default RegisterPage;
