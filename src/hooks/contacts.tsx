import { Contact } from "@interfaces/contacts/contacts.interface";
import { api } from "@service/api";
import { useQuery, UseQueryOptions } from "react-query";

export type GetUsersResponse = {
  contacts: Contact[];
  totalCount: number;
};

export async function getContacts(page: number): Promise<GetUsersResponse> {
  const { data } = await api.get("users", {
    params: {
      page,
    },
  });

  const contacts = data.users.map((contact: Contact) => ({
    ...contact,
    createdAt: new Date(contact.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }));

  return {
    contacts,
    totalCount: data.totalCount,
  };
}

export async function getOneContact(id: string): Promise<Contact> {
  const { data } = await api.get(`users/${id}`);

  return data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`users/${id}`);
}

export function useContacts(page: number, options: UseQueryOptions) {
  return useQuery(["users", page], () => getContacts(page), {
    initialData: options.initialData,
    staleTime: 1000 * 20,
  });
}
