import React from "react";
import MasterOfLists from "../assets/vector/Master-of-Lists-Locked.svg";
import TreeArchitect from "../assets/vector/Tree-Architect-Locked.svg";
import LogicSurvivor from "../assets/vector/Logic-Survivor-Locked.svg";

import { db } from "../services/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
// import { useUser } from "../context/UserContext";

const Achievements = () => {
  // const { userData } = useUser();

  const vectorLockedUrlMap = {
    "Master of Lists": MasterOfLists,
    "Tree Architect": TreeArchitect,
    "Logic Survivor": LogicSurvivor,
  };

  const achievementsRef = collection(db, "achievements");
  const q = query(achievementsRef, orderBy("name", "asc"));

  const [achievements, loading, error] = useCollectionData(q);

  console.log(achievements);

  return (
    <React.Fragment>
      <h2 className="text-3xl font-extrabold mb-8">Pencapaian</h2>

      <div className="grid grid-cols-2 gap-3">
        {achievements &&
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-7 border-2 border-zinc-200 rounded-xl flex flex-col justify-center items-center gap-2"
            >
              <img
                className="size-24"
                src={vectorLockedUrlMap[achievement.name]}
                alt={achievement.name}
              />
              <h3 className="text-xl font-bold">{achievement.name}</h3>
              <p className="font-medium text-zinc-500 text-center">
                {achievement.description}
              </p>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Achievements;
