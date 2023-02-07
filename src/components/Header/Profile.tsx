import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text color="gray.300">Leonardo Burati</Text>
          <Text color="gray.300" fontSize="small">
            leonardoburati@hotmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Leonardo Burati"
        src="https://github.com/Buratii.png"
      />
    </Flex>
  );
}
