// @ts-check
// @ts-ignore
import SLLIcon from "../../assets/vector/Linked-List-Primary.svg";
// @ts-ignore
import SLLIconCompleted from "../../assets/vector/Linked-List-Mint.svg";
// @ts-ignore
import StackIcon from "../../assets/vector/Stack-Primary.svg";
// @ts-ignore
import StackIconCompleted from "../../assets/vector/Stack-Mint.svg";
// @ts-ignore
import QueueIcon from "../../assets/vector/Queue-Primary.svg";
// @ts-ignore
import QueueIconCompleted from "../../assets/vector/Queue-Mint.svg";
// @ts-ignore
import TreeIcon from "../../assets/vector/Tree-Primary.svg";
// @ts-ignore
import TreeIconCompleted from "../../assets/vector/Tree-Mint.svg";

/**
 * @param {Object} props
 * @param {string} props.topic
 */
const CourseIcon = ({ topic, isCompleted }) => {
  switch (topic) {
    case "Singly Linked List":
      return (
        <img
          src={isCompleted ? SLLIconCompleted : SLLIcon}
          alt={topic}
          width={50}
        />
      );
    case "Stack":
      return (
        <img
          src={isCompleted ? StackIconCompleted : StackIcon}
          alt={topic}
          width={16}
        />
      );
    case "Queue":
      return (
        <img
          src={isCompleted ? QueueIconCompleted : QueueIcon}
          alt={topic}
          width={50}
        />
      );
    case "Binary Tree":
      return (
        <img
          src={isCompleted ? TreeIconCompleted : TreeIcon}
          alt={topic}
          width={30}
        />
      );
    default:
      return <span>ICON</span>;
  }
};

export default CourseIcon;
