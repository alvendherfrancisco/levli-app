import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas w-full relative flex">
      <BottomTabBar />
      <div className="flex-1 lg:ml-56 pb-24 lg:pb-0 w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
}