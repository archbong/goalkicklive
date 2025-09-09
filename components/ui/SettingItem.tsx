'use client';

import React, { ReactNode } from "react";

interface SettingItemProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function SettingItem({ title, description, children }: SettingItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
