import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchParent } from "../services/parentsApi";

const ParentContext = createContext();

export const ParentProvider = ({ children }) => {
  const { parentId } = useParams();

  const { data: parent, isLoading } = useQuery({
    queryKey: ["parent", parentId],
    queryFn: () => fetchParent(parentId),
    enabled: !!parentId,
  });

  const value = {
    parent,
    isLoading,
  };

  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
};

export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error("useParent must be used within a ParentProvider");
  }
  return context;
};
