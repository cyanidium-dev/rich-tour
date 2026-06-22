import crmInstance from "@/lib/crm/utils/crmInstance";
import { getCrmToken } from "@/lib/crm/utils/getCrmToken";

type CrmContact = {
    id?: string | number;
    phones?: string[];
    emails?: string[];
};

type CrmContactResponse = {
    dataArray?: CrmContact[];
};

function normalizeEmail(email: unknown): string {
    return String(email ?? "").trim().toLowerCase();
}

function normalizePhone(phone: unknown): string {
    const digits = String(phone ?? "").replace(/\D/g, "");

    if (digits.length === 10 && digits.startsWith("0")) {
        return `38${digits}`;
    }

    return digits;
}

async function isDeletedCrmContact(
    contactId: string | number,
    token: string
): Promise<boolean> {
    const { data } = await crmInstance.post<CrmContactResponse>(
        "contact/get/",
        {
            limit: 1,
            filter: {
                deleted: "1",
                id: contactId,
            },
        },
        {
            headers: {
                token,
                "Content-Type": "application/json",
            },
        }
    );

    return Array.isArray(data?.dataArray) && data.dataArray.length > 0;
}

export async function findAgentCrmIdByEmail(
    email: string,
    phone?: string
): Promise<string | null> {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        return null;
    }

    const token = await getCrmToken();
    const { data } = await crmInstance.post<CrmContactResponse>(
        "contact/get/",
        {
            fields: [
                "id",
                "phones",
                "emails",
            ],
            limit: 50,
            filter: {
                emails: [normalizedEmail],
            },
        },
        {
            headers: {
                token,
                "Content-Type": "application/json",
            },
        }
    );

    const contacts = Array.isArray(data?.dataArray) ? data.dataArray : [];
    const contactsWithIds = contacts.filter(
        (contact): contact is CrmContact & { id: string | number } =>
            contact.id !== undefined && contact.id !== null
    );

    const contactsWithDeletedState = await Promise.all(
        contactsWithIds.map(async (contact) => ({
            contact,
            isDeleted: await isDeletedCrmContact(contact.id, token),
        }))
    );
    const activeContacts = contactsWithDeletedState
        .filter(({ isDeleted }) => !isDeleted)
        .map(({ contact }) => contact);

    if (!activeContacts.length) {
        return null;
    }

    const normalizedPhone = normalizePhone(phone);
    const phoneMatchedContact = normalizedPhone
        ? activeContacts.find((contact) =>
            contact.phones?.some((contactPhone) => normalizePhone(contactPhone) === normalizedPhone)
        )
        : undefined;

    const selectedContact = phoneMatchedContact ?? activeContacts[0];

    return selectedContact.id ? String(selectedContact.id) : null;
}
