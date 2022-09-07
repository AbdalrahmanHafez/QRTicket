import React, { useState, useRef, useEffect, useCallback } from "react";

function Test() {
  useEffect(() => {
    console.log("Test rendered");
  });

  return (
    <div>
      <h1>test page</h1>
      <button>Click this first, it does notthing</button>
      <button
        onClick={() => {
          navigator.vibrate(500);
          alert("Helo");
        }}
      >
        TEST VIBRATE
      </button>
    </div>
  );
}

export default Test;
