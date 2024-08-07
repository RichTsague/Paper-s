// app/user/admin/comptabilite/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase-config";
import DateRangeInput from "@/components/DateRangeInput";
import formatDate from "@/components/formatDate";
import DateInput from "@/components/DateInput";
import { Label, Select, FileInput, Checkbox, TextInput } from "flowbite-react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute"; // Importez le composant de protection

interface Course {
  id: string;
  titre: string;
  date_heure_debut: Date;
  id_professeur: string;
}

interface Participation {
  id_cours: string;
  id_carte: string;
}

interface Carte {
  id: string;
  prix: number;
  credit: number;
}

interface Professeur {
  id: string;
  name: string;
  firstName: string;
}

const ComptabilitePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [filteredprofesseurs, setFilteredprofesseurs] = useState<Course[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("cours"); // Ajout de l'option de sélection

  // Fonction pour récupérer les cours et calculer les montants totaux
  useEffect(() => {
    const fetchCoursesAndProfessors = async () => {
      try {
        // Récupération des cours depuis Firestore
        const querySnapshot = await getDocs(collection(db, "cours"));
        const courseList: Course[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            titre: data.titre,
            date_heure_debut: data.date_heure_debut.toDate(),
            id_professeur: data.id_professeur,
          };
        });

        // Récupération des professeurs depuis Firestore
        const profQuerySnapshot = await getDocs(
          query(collection(db, "users"), where("status", "==", "professeur"))
        );
        const professeurList: Professeur[] = profQuerySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              firstName: data.firstName,
            };
          }
        );

        // Tri des cours par ordre croissant de date
        courseList.sort(
          (a, b) => a.date_heure_debut.getTime() - b.date_heure_debut.getTime()
        );
        setCourses(courseList);
        setFilteredCourses(courseList);
        setProfesseurs(professeurList);

        // Calculer le montant total pour chaque cours
        const amounts: { [key: string]: number } = {};
        for (const course of courseList) {
          const participationsSnapshot = await getDocs(
            query(
              collection(db, "participation"),
              where("id_cours", "==", course.id)
            )
          );
          const participations: Participation[] =
            participationsSnapshot.docs.map(
              (doc) => doc.data() as Participation
            );

          let totalAmount = 0;
          for (const participation of participations) {
            if (participation.id_carte) {
              const carteDocRef = doc(db, "cartes", participation.id_carte);
              const carteDoc = await getDoc(carteDocRef);
              if (carteDoc.exists()) {
                const carteData = carteDoc.data() as Carte;
                totalAmount += carteData.prix / carteData.credit;
              } else {
                console.error(
                  `Carte with ID ${participation.id_carte} not found`
                );
              }
            } else {
              console.error(
                "Participation missing 'id_cartes' field",
                participation
              );
            }
          }

          amounts[course.id] = totalAmount;
        }

        setAmounts(amounts);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des cours ou des participations :",
          error
        );
      }
    };

    fetchCoursesAndProfessors();
  }, []);

  // Fonction pour filtrer les cours en fonction des dates sélectionnées
  const handleFilter = () => {
    const filtered = courses.filter((course) => {
      const courseDate = course.date_heure_debut.getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      return courseDate >= start && courseDate <= end;
    });
    setFilteredCourses(filtered);
  };

  return (
    <AdminProtectedRoute>
      {" "}
      {/* Utilisez le composant de protection */}
      <div className="container mx-auto p-8 ">
        <h1 className="text-3xl  font-semibold  mb-8 text-center">
          Comptabilité
        </h1>
        <div className="mb-4">
          <Label htmlFor="option-select">Afficher par</Label>
          <Select
            id="option-select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="cours">Cours</option>
            <option value="professeurs">Professeurs</option>
          </Select>
        </div>
        <div>
          <DateInput date={startDate} setDate={setStartDate} />
          <DateInput date={endDate} setDate={setEndDate} />
        </div>

        {/* <DateRangeInput
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        /> */}
        <button
          onClick={handleFilter}
          className="mt-4 bg-c5 hover:bg-c4 text-white font-bold py-2 px-4 rounded"
        >
          Filtrer
        </button>
        {selectedOption === "cours" && (
          <div className=" overflow-x-auto max-h-screen  max-lg:md:max-w-md max-md:sm:max-w-xs mt-4">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-auto">
              <thead>
                <tr className=" bg-gray-100">
                  <th className="py-2 px-4 border-b text-center">Titre</th>
                  <th className="py-2 px-4 border-b text-center">Date</th>
                  <th className="py-2 px-4 border-b text-center">Professeur</th>
                  <th className="py-2 px-4 border-b text-center">
                    Montant Total (€)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="py-2 px-4 border-b text-center">
                      {course.titre}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {formatDate(course.date_heure_debut)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {professeurs.find(
                        (prof) => prof.id === course.id_professeur
                      )
                        ? `${
                            professeurs.find(
                              (prof) => prof.id === course.id_professeur
                            )?.firstName
                          } ${
                            professeurs.find(
                              (prof) => prof.id === course.id_professeur
                            )?.name
                          }`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {amounts[course.id]?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedOption === "professeurs" && (
          <div className=" overflow-x-auto max-h-screen  max-lg:md:max-w-md max-md:sm:max-w-xs mt-4">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-auto">
              <thead>
                <tr className=" bg-gray-100">
                  <th className="py-2 px-4 border-b text-center">Professeur</th>
                  <th className="py-2 px-4 border-b text-center">Cours</th>
                  <th className="py-2 px-4 border-b text-center">Date</th>
                  <th className="py-2 px-4 border-b text-center">
                    Montant Total (€)
                  </th>
                </tr>
              </thead>
              <tbody>
                {professeurs.map((professeur) => (
                  <React.Fragment key={professeur.id}>
                    <tr>
                      <td
                        className="py-2 px-4 border-b text-center"
                        colSpan={4}
                      >
                        <strong>{`${professeur.firstName} ${professeur.name}`}</strong>
                      </td>
                    </tr>
                    {courses
                      .filter(
                        (course) => course.id_professeur === professeur.id
                      )
                      .map((course) => (
                        <tr key={course.id}>
                          <td className="py-2 px-4 border-b text-center"></td>{" "}
                          {/* Cellule vide pour l'affichage en escalier */}
                          <td className="py-2 px-4 border-b text-center">
                            {course.titre}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {formatDate(course.date_heure_debut)}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {amounts[course.id]?.toFixed(2) || "0.00"}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default ComptabilitePage;
