"use client";

import { useContext } from "react";
import { modelContext } from "./context";

function useModel() {
  const context = useContext(modelContext);
  return context;
}

export default useModel;
