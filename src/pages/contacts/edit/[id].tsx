import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Header } from "@components/Header";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Sidebar } from "@components/Sidebar";
import Link from "next/link";
import { Input } from "@components/Form/Input";
import { SubmitHandler } from "react-hook-form/dist/types";
import { handlePhone } from "@utils/phoneMask";
import {
  Contact,
  EditContactFormData,
} from "@interfaces/contacts/contacts.interface";
import { api } from "@service/api";
import { useMutation } from "react-query";
import { queryClient } from "@service/queryClient";
import { useRouter } from "next/router";
import { getOneContact } from "@hooks/contacts";
import { GetServerSideProps } from "next";
import { useMemo } from "react";

type PageProps = {
  contact: Contact;
};

const editFormSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório."),
  email: Yup.string()
    .required("E-mail é obrigatório.")
    .email("E-mail inválido."),
  phone: Yup.string()
    .required("Phone é obrigatório.")
    .min(15, "Número inválido"),
});

export default function EditUser({ contact }: PageProps) {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<EditContactFormData>({
    resolver: yupResolver(editFormSchema),
    defaultValues: useMemo(() => {
      return contact;
    }, [contact]),
  });

  const { errors } = formState;

  const editContact = useMutation(
    async (contact: EditContactFormData) => {
      const { data } = await api.patch(`users/${contact.id}`, {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const handleEdit: SubmitHandler<EditContactFormData> = async (values) => {
    const data = {
      ...values,
      id: contact._id,
    };

    await editContact.mutateAsync(data);

    router.push("/");
  };

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex
        as="form"
        w="100%"
        h="100%"
        maxW={1480}
        mx="auto"
        onSubmit={handleSubmit(handleEdit)}
      >
        <Sidebar />

        <Box flex="1" borderRadius={8} p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">
            Editar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing={["6", "8"]}>
            <Input
              label="Nome completo"
              error={errors.name}
              {...register("name")}
            />

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                type="email"
                error={errors.email}
                label="E-mail"
                {...register("email")}
              />
              <Input
                label="Telefone"
                error={errors.phone}
                maxLength={15}
                onKeyUp={handlePhone}
                {...register("phone")}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button as={Link} href="/" colorScheme="whiteAlpha">
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps<{
  contact: Contact;
}> = async (context) => {
  const { id } = context.query;

  const contact = await getOneContact(id);

  return {
    props: {
      contact,
    },
  };
};
