import { Box } from "@chakra-ui/react";

interface Node {
  name: string;
  type: string;
}

interface FlowSidebarProps {
  nodes: Node[];
}

export default function FlowSidebar({ nodes }: FlowSidebarProps) {
  const onDragStart = (event, node) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box as="aside" w="64" p="6" bg="gray.800" borderTopLeftRadius={8}>
      <Box>You can drag these nodes to the pane on the right.</Box>
      {nodes.map((node) => (
        <Box
          key={node.name}
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="20px"
          p="4px"
          mt="10px"
          cursor="grab"
          borderWidth={1}
          borderColor="gray.700"
          onDragStart={(event) => onDragStart(event, node)}
          draggable
        >
          {node.name}
        </Box>
      ))}
    </Box>
  );
}
