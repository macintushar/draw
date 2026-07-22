import { Button, Heading, Hr, Link, Text } from "react-email";
import { EmailLayout } from "./components/layout";

interface ChangeEmailEmailProps {
  newEmail: string;
  confirmationUrl: string;
}

export default function ChangeEmailEmail({
  newEmail,
  confirmationUrl,
}: ChangeEmailEmailProps) {
  return (
    <EmailLayout preview="Confirm your new Draw email address">
      <Heading as="h1" className="m-0 mb-4 text-2xl font-bold text-gray-900">
        Confirm your new email
      </Heading>
      <Text className="m-0 mb-4 text-base leading-7 text-gray-800">
        We received a request to change the email address for your Draw
        account to <strong>{newEmail}</strong>. Click the button below to
        confirm this change.
      </Text>
      <Button
        href={confirmationUrl}
        className="box-border block rounded-md bg-brand px-6 py-3 text-center text-base font-semibold text-white no-underline"
      >
        Confirm New Email
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
        If you didn't request this change, you can safely ignore this email —
        your email address will stay the same.
      </Text>
    </EmailLayout>
  );
}

ChangeEmailEmail.PreviewProps = {
  newEmail: "mac@justapps.com",
  confirmationUrl: "https://example.com/auth/confirm?token=abc123",
} satisfies ChangeEmailEmailProps;

export { ChangeEmailEmail };
