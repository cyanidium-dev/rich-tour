import ContactsInfo from "@/components/contacts/contactsInfo/ContactsInfo";
import Hero from "@/components/contacts/hero/Hero";
import { getSiteContacts } from "@/shared/api/server";

export default async function ContactsPage() {
  const contacts = await getSiteContacts();
  return (
    <>
      <Hero />
      <ContactsInfo contacts={contacts} />
    </>
  );
}
