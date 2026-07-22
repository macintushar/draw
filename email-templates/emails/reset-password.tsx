import { Button, Heading, Hr, Link, Text } from "react-email";
import { EmailLayout } from "./components/layout";

interface ResetPasswordEmailProps {
  email: string;
  confirmationUrl: string;
}

export default function ResetPasswordEmail({
  email,
  confirmationUrl,
}: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset your Draw password">
      <Heading as="h1" className="m-0 mb-4 text-2xl font-bold text-gray-900">
        Reset your password
      </Heading>
      <Text className="m-0 mb-4 text-base leading-7 text-gray-800">
        We received a request to reset the password for your Draw account (
        <strong>{email}</strong>). Click the button below to choose a new one.
      </Text>
      <Button
        href={confirmationUrl}
        className="box-border block rounded-md bg-brand px-6 py-3 text-center text-base font-semibold text-white no-underline"
      >
        Reset Password
      </Button>
      <Text className="mb-0 mt-6 text-sm leading-6 text-gray-500">
        Or copy and paste this link into your browser:
      </Text>
      <Link
        href={confirmationUrl}
        className="break-all text-sm leading-6 text-blue-600 underline"
      >
        {confirmationUrl}
      </Link>
      <Hr className="my-6 border-solid border-gray-200" />
      <Text className="m-0 text-sm leading-6 text-gray-500">
        This link expires in 1 hour and can only be used once. If you didn't
        request a password reset, you can safely ignore this email — your
        password will stay the same.
      </Text>
    </EmailLayout>
  );
}

ResetPasswordEmail.PreviewProps = {
  email: "mac@justapps.com",
  confirmationUrl: "https://example.com/auth/confirm?token=abc123",
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
