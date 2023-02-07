export interface Contact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface CreateContactFormData {
  name: string;
  phone: string;
  email: string;
}

export interface EditContactFormData {
  id: string;
  name: string;
  phone: string;
  email: string;
}
