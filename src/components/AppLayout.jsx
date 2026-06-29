import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 w-full relative">
      <div className="max-w-lg mx-auto pb-24">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}