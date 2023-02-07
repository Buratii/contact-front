import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCount: number;
  limitPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

export function Pagination({
  totalCount,
  limitPerPage = 5,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCount / limitPerPage);
  console.log("lastPage", lastPage);
  console.log("totalCount", totalCount);
  console.log("limitPerPage", limitPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justify="space-between"
      spacing="6"
      align="center"
    >
      <Box>
        <strong>8</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>
      <HStack spacing="2">
        {currentPage > 2 + siblingsCount && (
          <PaginationItem onPageChange={onPageChange} number={1} />
        )}

        {previousPages.length > 0 &&
          previousPages.map((page) => (
            <>
              {currentPage > 2 + siblingsCount && (
                <Text key={page} color="gray.300" width="6" textAlign="center">
                  ...
                </Text>
              )}
              <PaginationItem
                key={page}
                onPageChange={onPageChange}
                number={page}
              />
            </>
          ))}

        <PaginationItem
          number={currentPage}
          onPageChange={onPageChange}
          isCurrent
        />

        {nextPages.length > 0 &&
          nextPages.map((page) => (
            <PaginationItem
              key={page}
              onPageChange={onPageChange}
              number={page}
            />
          ))}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text color="gray.300" width="6" textAlign="center">
                ...
              </Text>
            )}
            <PaginationItem number={lastPage} onPageChange={onPageChange} />
          </>
        )}
      </HStack>
    </Stack>
  );
}
