import { render } from "react-email";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { ConfirmSignupEmail } from "./emails/confirm-signup";
import { ResetPasswordEmail } from "./emails/reset-password";
import { ChangeEmailEmail } from "./emails/change-email";

// Renders the templates with Supabase's Go template variables so the output
// can be pasted straight into Supabase Dashboard -> Auth -> Email Templates.
// See docs/supabase.md for details.
const templates = {
  "confirm-signup": (
    <ConfirmSignupEmail
      email="{{ .Email }}"
      confirmationUrl="{{ .ConfirmationURL }}"
    />
  ),
  "reset-password": (
    <ResetPasswordEmail
      email="{{ .Email }}"
      confirmationUrl="{{ .ConfirmationURL }}"
    />
  ),
  "change-email": (
    <ChangeEmailEmail
      newEmail="{{ .NewEmail }}"
      confirmationUrl="{{ .ConfirmationURL }}"
    />
  ),
};

const outDir = new URL("./out/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });
await cp(new URL("./emails/static/", import.meta.url).pathname, outDir + "static", {
  recursive: true,
});

for (const [name, element] of Object.entries(templates)) {
  const html = await render(element, { pretty: true });
  await writeFile(`${outDir}${name}.html`, html);
  console.log(`Rendered out/${name}.html`);
}
