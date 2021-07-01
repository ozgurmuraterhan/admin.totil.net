import ForgotPasswordForm from "@components/auth/forget-password/forget-password";
import Logo from "@components/ui/logo";
import { SUPER_ADMIN } from "@utils/constants";
import { parseContextCookie } from "@utils/parse-cookie";
import { ROUTES } from "@utils/routes";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = parseContextCookie(context?.req?.headers?.cookie);
  if (cookies?.auth_token) {
    if (cookies?.auth_permissions?.includes(SUPER_ADMIN)) {
      return {
        redirect: { destination: ROUTES.DASHBOARD, permanent: false },
      };
    }
  }
  return {
    props: {},
  };
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-white sm:bg-gray-100">
      <div className="m-auto max-w-sm w-full bg-white sm:shadow p-5 sm:p-8 rounded">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <h3 className="text-center text-base italic text-gray-500 mb-6 mt-4">
          Forgot Password
        </h3>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
