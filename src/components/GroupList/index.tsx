import { GroupModel } from "@/core/models/chatMessage/messageModel";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  groups: GroupModel[];
}

const GroupListCard: React.FC<Props> = ({ groups }) => {
  const navigate = useNavigate();
  const topGroups = groups.slice(0, 5);
return (
  <div className="sticky top-[100px] mt-6 p-3 rounded-lg shadow-md z-20 
                  text-white bg-gradient-to-br from-indigo-500 to-purple-600 
                  dark:from-indigo-600 dark:to-purple-700">

    <h2 className="text-base font-semibold mb-3">Kanallarımız</h2>

    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 
                    scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent 
                    hover:scrollbar-thumb-white/50">
      {topGroups.map((group, index) => (
        <div
          key={index}
          className="bg-white/10 rounded-md p-2 hover:bg-white/20 transition"
        >
          <h3 className="text-sm font-medium">{group.groupName}</h3>
          <p className="text-xs opacity-80">{group.description}</p>
        </div>
      ))}
    </div>

    <div className="mt-3 text-center">
      <button
        onClick={() => navigate("/groups")}
        className="text-xs underline hover:opacity-80 transition"
      >
        Daha Fazlası ve Katılmak İçin Tıklayınız
      </button>
    </div>
  </div>
);



};

export default GroupListCard;