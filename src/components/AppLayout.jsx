import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      <div className="pb-24">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}