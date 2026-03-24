import { Contact } from "../../components/Contact";
import Link from "next/link";

const tabs = [
  { name: "Menu", path: "/admin/menu" },
  { name: "Blog", path: "/admin/blog" },
  { name: "Events", path: "/admin/events" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Contacts", path: "/admin/contacts" },
];

export default function ContactPage() {
  return <Contact />;
}
