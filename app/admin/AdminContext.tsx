"use client";
import { createContext, useContext } from "react";

export const AdminContext = createContext<{
  adminKey: string;
  setAdminKey: (k: string) => void;
  logout: () => void;
}>({ adminKey: "", setAdminKey: () => {}, logout: () => {} });

export function useAdmin() {
  return useContext(AdminContext);
}
