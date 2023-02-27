import { Flex } from "@chakra-ui/react";
import FlowSidebar from "@components/FlowSidebar";
import { Header } from "@components/Header";
import { CalcNode } from "@components/Nodes";
import { Sidebar } from "@components/Sidebar";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MiniMap,
} from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";

const nodeTypes = {
  selectorNode: CalcNode,
};

const nodesFake = [
  {
    type: "input",
    data: { label: "" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const teste = event.dataTransfer.getData("application/reactflow");

      const parsedNode = JSON.parse(teste);

      // check if the dropped element is valid
      if (typeof parsedNode.type === "undefined" || !parsedNode.type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left - 600,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: parsedNode.type,
        position,
        data: { label: `${parsedNode.name}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <Flex h="100vh" direction="column">
      <Header />

      <Flex w="100%" h="100%" maxW={1480} mx="auto" ref={reactFlowWrapper}>
        <Sidebar />
        <FlowSidebar nodes={nodesFake} />
        <ReactFlowProvider>
          <ReactFlow
            style={{ backgroundColor: "white" }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <MiniMap style={{ height: 120 }} zoomable pannable />
          </ReactFlow>
        </ReactFlowProvider>
      </Flex>
    </Flex>
  );
}
