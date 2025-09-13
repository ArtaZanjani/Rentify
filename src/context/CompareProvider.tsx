"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

type CompareContextType = {
  selectedIds: string[];
  searching: boolean;
  isConfirm: boolean;
  toggleId: (id: string) => void;
  toggleSearching: (value: boolean) => void;
  toggleConfirm: (value: boolean) => void;
  resetAll: () => void; // new function
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          toast.error("فقط می‌توانید حداکثر 3 آگهی را انتخاب کنید");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const toggleSearching = (value: boolean) => {
    setSearching(value);
  };

  const toggleConfirm = (value: boolean) => {
    setIsConfirm(value);
  };

  const resetAll = () => {
    setSelectedIds([]);
    setSearching(false);
    setIsConfirm(false);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        searching,
        isConfirm,
        toggleId,
        toggleSearching,
        toggleConfirm,
        resetAll, // provide it in context
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
