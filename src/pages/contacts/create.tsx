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
import { CreateContactFormData } from "@interfaces/contacts/contacts.interface";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { api } from "@service/api";
import { queryClient } from "@service/queryClient";

const createFormSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório."),
  email: Yup.string()
    .required("E-mail é obrigatório.")
    .email("E-mail inválido."),
  phone: Yup.string()
    .required("Phone é obrigatório.")
    .min(15, "Número inválido"),
});

export default function CreateUser() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<CreateContactFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const { errors } = formState;

  const createContact = useMutation(
    async (contact: CreateContactFormData) => {
      const { data } = await api.post("users", contact);

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const handleRegister: SubmitHandler<CreateContactFormData> = async (
    values
  ) => {
    await createContact.mutateAsync(values);

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
        onSubmit={handleSubmit(handleRegister)}
      >
        <Sidebar />

        <Box flex="1" borderRadius={8} p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">
            Criar usuário
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
