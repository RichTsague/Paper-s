"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase-config";
import TableSkeleton from "../TableSkeleton";
import BoutonSupression from "@/components/BoutonSupression";

interface Professor {
  id: string;
  firstName: string;
  name: string;
  email: string;
}

const ProfessorTable: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "users"),
          where("status", "==", "professeur")
        );
        const querySnapshot = await getDocs(q);
        const professorsList: Professor[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName,
          name: doc.data().name,
          email: doc.data().email,
        }));
        setProfessors(professorsList);
      } catch (err) {
        setError("Erreur lors de la récupération des professeurs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setProfessors(professors.filter((professor) => professor.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression du professeur", err);
      setError("Erreur lors de la suppression du professeur");
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full">{error}</div>
    );
  }

  return (
    <div className=" overflow-x-auto max-h-screen  max-lg:md:max-w-md max-md:sm:max-w-xs ">
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-auto">
        <thead>
          <tr className=" bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Nom</th>
            <th className="py-2 px-4 border-b text-center">Prénom</th>
            <th className="py-2 px-4 border-b text-center">Email</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor) => (
            <tr key={professor.id}>
              <td className="py-2 px-4 border-b text-center">
                {professor.name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {professor.firstName}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {professor.email}
              </td>
              <td className="flex py-2 px-4 border-b text-center justify-center">
                <BoutonSupression onDelete={() => handleDelete(professor.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorTable;
