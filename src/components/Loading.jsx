import React from "react";
import "../App.css";
const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column'
      }}
    >
      <div className="loading"></div>
    </div>
  );
};

export default Loading;
