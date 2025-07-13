import React from 'react';

const UserSearchInput = () => {
  return (
    <input
      type="text"
      placeholder="Search User..."
      className="w-full px-2 py-1 rounded-md border border-[#2b4560] 
                 text-[#2b4560] placeholder-[#2b4560] 
                 bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4560]"
    />
  );
};

export default UserSearchInput;
