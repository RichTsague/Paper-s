// pages/students.tsx
import React from "react";
import StudentTable from "@/components/StudentTable";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const StudentsPage: React.FC = () => {
  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-8">
        <div className="max-w-5xl w-full">
          <h1 className="text-2xl font-bold mb-6">Liste des Élèves</h1>
          <StudentTable />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default StudentsPage;
