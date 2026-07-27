import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full relative flex">
      {/* Left nav rail on desktop */}
      <BottomTabBar />
      {/* Main content — on desktop, offset for the left rail */}
      <div className="flex-1 lg:ml-56 pb-24 lg:pb-0 w-full min-w-0 bg-gray-50 dark:bg-gray-950">
        <Outlet />
      </div>
    </div>
  );
}