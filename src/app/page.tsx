// src/app/page.tsx  (Server Component OK)
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/equinos");
}
