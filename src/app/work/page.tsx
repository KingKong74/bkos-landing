import { redirect } from "next/navigation";

// The old /work page now lives in the Resume tab on the home page.
export default function Work() {
  redirect("/#resume");
}
