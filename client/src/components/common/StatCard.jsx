import PropTypes from 'prop-types'
import React from "react";

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="relative flex justify-center gap-3 text-gray-700 bg-white shadow-md p-1 items-center  my-5 py-8 lg:py-16 w-[15rem] lg:w-[18rem] lg:h-20 rounded-none bg-clip-border">
        {icon}
      <div className="flex-col"> 
        <div className="text-sm text-gray-400">
          {title}
        </div>
        <div className="font-sans text-xl lg:text-lg font-semibold text-left text-gray-600">
          {value}
        </div>
      </div>
    </div>
  );
};
StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

};

export default StatCard;
