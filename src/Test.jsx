import { ArcherContainer, ArcherElement } from "react-archer";
import treesJson from "./data/trees.json";
import Journey from "./pages/Journey";

const Test = () => {
  const getTrees = treesJson.find((item) => item.id === "tr-04");

  const { initial_layout } = getTrees;
  const { nodes, edges } = initial_layout;

  return (
    <ArcherContainer
      strokeColor="hsl(200, 87%, 52%)"
      strokeWidth={3}
      endShape={{ arrow: { arrowLength: 6, arrowThickness: 6 } }}
    >
      <div className="w-full h-screen relative">
        {nodes.map((node) => {
          edges
            .filter((e) => e.from === node.id)
            .map((e) => {
              console.log("edges: " + e);
            });

          return (
            <ArcherElement
              key={node.id}
              id={node.id}
              relations={[
                ...edges
                  .filter((e) => e.from === node.id)
                  .map((e) => ({
                    targetId: e.to,
                    targetAnchor: "top",
                    sourceAnchor: "middle",
                    style: {
                      strokeColor: "hsl(200, 87%, 52%)",
                      strokeWidth: 3,
                    },
                  })),
              ]}
            >
              <div
                style={{
                  position: "absolute",
                  left: node.initial_x,
                  top: node.initial_y,
                }}
                className="size-12.5 flex items-center justify-center border-2 border-primary rounded-full bg-white"
              >
                {node.label}
              </div>
            </ArcherElement>
          );
        })}
      </div>
    </ArcherContainer>
  );
};

export default Test;
