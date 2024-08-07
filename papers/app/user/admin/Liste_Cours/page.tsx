"use client";

import React from "react";
import CourseTable from "@/components/CourseTable";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const liste_cours: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-8">
        <div className="max-w-5xl w-full">
          <h1 className="text-2xl font-bold mb-6">Liste des Cours</h1>
          <CourseTable />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default liste_cours;
