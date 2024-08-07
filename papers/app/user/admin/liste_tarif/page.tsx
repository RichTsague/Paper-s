// pages/rates.tsx
"use client";
import React from "react";
import RatesTable from "@/components/RatesTable";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const RatesPage: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-8">
        <div className="max-w-5xl w-full">
          <h1 className="text-2xl font-bold mb-6">Liste des tarifs</h1>
          <RatesTable />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default RatesPage;
