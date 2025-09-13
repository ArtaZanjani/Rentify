import ChangePath from "./ChangePath";

type AutoLayoutPropsType = {
  label: string;
  isOTP: boolean;
  children: React.ReactNode;
};

const AuthLayout = ({ label, isOTP, children }: AutoLayoutPropsType) => {
  return (
    <>
      <h1 className="mt-20 text-h3">{label}</h1>

      {!isOTP && <ChangePath />}

      <div className="w-full mt-6">{children}</div>
    </>
  );
};

export default AuthLayout;
