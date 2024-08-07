"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfesseurInput from "@/components/ProfesseurInput";
import TypeDeCoursInput from "@/components/TypeDeCoursInput";
import TitleInput from "@/components/TitleInput";
import DescriptionInput from "@/components/DescriptionInput";
import DateInput from "@/components/DateInput";
import { Label, FileInput, Checkbox, TextInput } from "flowbite-react";
import DurationInput from "@/components/DurationInput";
import { db, storage } from "@/config/firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ValidationButton from "@/components/ValidationButton";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const CreateCours: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [courseType, setCourseType] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [periodicity, setPeriodicity] = useState<number>(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This will run only on the client side
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors: { [key: string]: string } = {};

    if (!title) formErrors.title = "Le titre est requis.";
    if (!description) formErrors.description = "La description est requise.";
    if (!professorId) formErrors.professor = "Le professeur est requis.";
    if (!courseType) formErrors.courseType = "Le type de cours est requis.";
    if (!date) formErrors.date = "La date et l'heure sont requises.";
    if (duration.hours === 0 && duration.minutes === 0)
      formErrors.duration = "La durée est requise.";

    if (isRecurrent && periodicity < 1)
      formErrors.periodicity = "La périodicité doit être d'au moins 1 semaine.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");

    try {
      const baseDate = new Date(date);
      let photoURL = "";

      if (photo) {
        const photoRef = ref(storage, `photos/${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }

      for (let i = 0; i < periodicity; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + i * 7);
        const dateTimestamp = Timestamp.fromDate(currentDate);

        await addDoc(collection(db, "cours"), {
          titre: title,
          description: description,
          type: courseType,
          date_heure_debut: dateTimestamp,
          duree: {
            heures: duration.hours,
            minutes: duration.minutes,
          },
          nom_professeur: professorName,
          id_professeur: professorId,
          photo: photoURL,
          periodicite: isRecurrent ? periodicity : 1,
        });
      }

      setMessage("Cours créés avec succès");
      setTitle("");
      setDescription("");
      setProfessorId("");
      setProfessorName("");
      setCourseType("");
      setDate("");
      setDuration({ hours: 0, minutes: 0 });
      setPeriodicity(1);
      setPhoto(null);
      setIsRecurrent(false);
    } catch (error: any) {
      setErrors({
        general: `Erreur lors de la création du cours: ${error.message}`,
      });
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md ">
          <h1 className="text-center font-semibold text-2xl mb-6">
            Créer un cours
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TitleInput title={title} setTitle={setTitle} />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
            <ProfesseurInput
              professorId={professorId}
              setProfessorId={setProfessorId}
              setProfessorName={setProfessorName}
            />
            {errors.professor && (
              <p className="text-red-500">{errors.professor}</p>
            )}
            <TypeDeCoursInput
              typeDeCours={courseType}
              setTypeDeCours={setCourseType}
            />
            {errors.courseType && (
              <p className="text-red-500">{errors.courseType}</p>
            )}
            <DateInput date={date} setDate={setDate} />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
            <DurationInput duration={duration} setDuration={setDuration} />
            {errors.duration && (
              <p className="text-red-500">{errors.duration}</p>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="recurrence"
                  checked={isRecurrent}
                  onChange={(e) => setIsRecurrent(e.target.checked)}
                />
                <Label htmlFor="recurrent">Ajouter une récurrence</Label>
              </div>
            </div>
            {isRecurrent && (
              <div className="flex items-center">
                <Label htmlFor="periodicity">Périodicité (en semaines) </Label>
                <TextInput
                  type="number"
                  id="periodicity"
                  value={periodicity}
                  onChange={(e) => setPeriodicity(parseInt(e.target.value))}
                  // className="border border-gray-300 rounded-md px-2 py-1"
                  min={1}
                  max={44}
                  required
                />
                {errors.periodicity && (
                  <p className="text-red-500">{errors.periodicity}</p>
                )}
              </div>
            )}
            <div id="fileUpload" className="max-w-md">
              <Label htmlFor="file" value="Photo" />
              <FileInput
                id="file"
                onChange={handlePhotoChange}
                accept="image/*"
              />
            </div>
            {errors.photo && <p className="text-red-500">{errors.photo}</p>}

            {errors.general && <p className="text-red-500">{errors.general}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <ValidationButton text="Créer un cours" />
          </form>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default CreateCours;
