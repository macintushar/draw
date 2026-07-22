import { Button, Heading, Hr, Link, Text } from "react-email";
import { EmailLayout } from "./components/layout";

interface ConfirmSignupEmailProps {
  email: string;
  confirmationUrl: string;
}

export default function ConfirmSignupEmail({
  email,
  confirmationUrl,
}: ConfirmSignupEmailProps) {
  return (
    <EmailLayout preview="Confirm your email address to start drawing">
      <Heading as="h1" className="m-0 mb-4 text-2xl font-bold text-gray-900">
        Confirm your email
      </Heading>
      <Text className="m-0 mb-4 text-base leading-7 text-gray-800">
        Thanks for signing up for Draw. Click the button below to confirm{" "}
        <strong>{email}</strong> and activate your account.
      </Text>
      <Button
        href={confirmationUrl}
        className="box-border block rounded-md bg-brand px-6 py-3 text-center text-base font-semibold text-white no-underline"
      >
        Confirm Email Address
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
        If you didn't create an account, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

ConfirmSignupEmail.PreviewProps = {
  email: "mac@justapps.com",
  confirmationUrl: "https://example.com/auth/confirm?token=abc123",
} satisfies ConfirmSignupEmailProps;

export { ConfirmSignupEmail };
