import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Header } from "@components/Header";
import { Pagination } from "@components/Pagination";
import { Sidebar } from "@components/Sidebar";
import {
  getContacts,
  getOneContact,
  GetUsersResponse,
  useContacts,
} from "@hooks/contacts";
import { Contact } from "@interfaces/contacts/contacts.interface";
import { api } from "@service/api";
import { queryClient } from "@service/queryClient";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { useMutation } from "react-query";

export default function Home({
  contacts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useContacts(page, {
    initialData: contacts,
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefatchContact(id: string) {
    await queryClient.prefetchQuery(["users", id], () => getOneContact(id), {
      staleTime: 1000 * 60 * 10,
    });
  }

  const deleteContact = useMutation(
    async (id: string) => {
      const { data } = await api.delete(`users/${id}`);

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" h="100%" maxW={1480} mx="auto">
        <Sidebar />

        <Box flex="1" borderRadius={8} p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Contatos
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            <Button
              as={Link}
              size="sm"
              colorScheme="pink"
              href="/contacts/create"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Criar novo
            </Button>
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos contatos.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha" bg="gray.800" borderRadius={8}>
                <Thead>
                  <Tr>
                    <Th>Contato</Th>

                    <Th>Telefone</Th>

                    {isWideVersion && <Th>Data de cadastro</Th>}

                    <Th w="8"></Th>

                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {data?.contacts.map((contact: Contact) => (
                    <Tr key={contact._id}>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{contact.name}</Text>
                          <Text fontSize="sm" color="gray.300">
                            {contact.email}
                          </Text>
                        </Box>
                      </Td>

                      <Td>{contact.phone}</Td>

                      {isWideVersion && <Td>{contact.createdAt}</Td>}

                      {isWideVersion && (
                        <Td pr="2">
                          <Button
                            as={Link}
                            size="sm"
                            colorScheme="purple"
                            href={`/contacts/edit/${contact._id}`}
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                            onMouseEnter={() =>
                              handlePrefatchContact(contact._id)
                            }
                          >
                            <Text lineHeight="0">Editar</Text>
                          </Button>
                        </Td>
                      )}

                      <Td pl="2">
                        <IconButton
                          aria-label="Delete contact"
                          icon={<Icon as={RiDeleteBinLine} />}
                          fontSize="18"
                          size="sm"
                          colorScheme="red"
                          onClick={() => deleteContact.mutate(contact._id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination
                totalCount={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps<{
  contacts: GetUsersResponse;
}> = async () => {
  const contacts = await getContacts(1);

  return {
    props: {
      contacts,
    },
  };
};
