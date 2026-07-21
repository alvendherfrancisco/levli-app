import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";
import AppBackground from "@/components/AppBackground";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-gray-950 w-full relative flex">
      <BottomTabBar />
      <div className="flex-1 lg:ml-60 pb-28 lg:pb-0 w-full min-w-0 relative">
        <AppBackground />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}