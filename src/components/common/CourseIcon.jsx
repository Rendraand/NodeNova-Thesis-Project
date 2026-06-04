// @ts-check
// @ts-ignore
import SLLIcon from "../../assets/vector/Linked-List-Vector.svg";
// @ts-ignore
import StackIcon from "../../assets/vector/Stack-Vector.svg";
// @ts-ignore
import QueueIcon from "../../assets/vector/Queue-Vector.svg";
// @ts-ignore
import TreeIcon from "../../assets/vector/Tree-Vector.svg";

/**
 * @param {Object} props
 * @param {string} props.topic
 */
const CourseIcon = ({ topic }) => {
  switch (topic) {
    case "Singly Linked List":
      return <img src={SLLIcon} alt={topic} width={"100%"} />;
    case "Stack":
      return <img src={StackIcon} alt={topic} width={16} />;
    case "Queue":
      return <img src={QueueIcon} alt={topic} width={"100%"} />;
    case "Binary Tree":
      return <img src={TreeIcon} alt={topic} width={36} />;
    default:
      return <span>ICON</span>;
  }
};

export default CourseIcon;
