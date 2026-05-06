import { permanentRedirect } from "next/navigation";

// No duplicate homepage: permanently consolidate `/` → `/ja` for crawlers.
export default function Home() {
  permanentRedirect("/ja");
}
