"use client";

import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import ProfesseurInput from "@/components/ProfesseurInput";
import CoursInput from "@/components/CoursInput";
import DateInput from "@/components/DateInput";
import DescriptionInput from "@/components/DescriptionInput";
import ValidationButton from "@/components/ValidationButton";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { Label, TextInput } from "flowbite-react";

interface Transaction {
  id: string;
  title: string;
  date: string;
  description: string;
  amount: number;
  professorId: string;
  professorName: string;
  courseId: string;
  courseTitle: string;
}

const TransactionPage: React.FC = () => {
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: "",
    title: "",
    date: "",
    description: "",
    amount: 0,
    professorId: "",
    professorName: "",
    courseId: "",
    courseTitle: "",
  });
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const setProfessorId = (professorId: string) => {
    setNewTransaction({ ...newTransaction, professorId });
  };

  const setProfessorName = (professorName: string) => {
    setNewTransaction({ ...newTransaction, professorName });
  };

  const setCourseId = (courseId: string) => {
    setNewTransaction({ ...newTransaction, courseId });
  };

  const setCourseTitle = (courseTitle: string) => {
    setNewTransaction({ ...newTransaction, courseTitle });
  };

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors: { [key: string]: string } = {};
    if (!newTransaction.title) formErrors.title = "Le titre est requis.";
    if (!newTransaction.date) formErrors.date = "La date est requise.";
    if (!newTransaction.amount) formErrors.amount = "Le montant est requis.";
    if (!newTransaction.professorId)
      formErrors.professor = "Le professeur est requis.";
    if (!newTransaction.courseId) formErrors.course = "Le cours est requis.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");

    try {
      const transactionData = {
        ...newTransaction,
        date: Timestamp.fromDate(new Date(newTransaction.date)),
      };

      await addDoc(collection(db, "transactions"), transactionData);

      setMessage("Transaction créée avec succès");
      setNewTransaction({
        id: "",
        title: "",
        date: "",
        description: "",
        amount: 0,
        professorId: "",
        professorName: "",
        courseId: "",
        courseTitle: "",
      });
      setDescription("");
    } catch (error: any) {
      setErrors({
        general: `Erreur lors de la création de la transaction: ${error.message}`,
      });
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex justify-center items-center w-full p-2">
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-8 text-center">
            Page de Transactions
          </h1>
          <form className="flex flex-col gap-5" onSubmit={handleAddTransaction}>
            <div>
              <Label htmlFor="title">Titre</Label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTransaction.title}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>
            <DateInput
              date={newTransaction.date}
              setDate={(date) => setNewTransaction({ ...newTransaction, date })}
            />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />
            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <TextInput
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                min={0}
                max={2000}
                required
              />
              {errors.amount && <p className="text-red-500">{errors.amount}</p>}
            </div>
            <div className="col-span-1 md:col-span-2">
              <ProfesseurInput
                professorId={newTransaction.professorId}
                setProfessorId={setProfessorId}
                setProfessorName={setProfessorName}
              />
              {errors.professor && (
                <p className="text-red-500">{errors.professor}</p>
              )}
            </div>
            <div className="col-span-1 md:col-span-2">
              <CoursInput
                courseId={newTransaction.courseId}
                setCourseId={setCourseId}
                setCourseTitle={setCourseTitle}
              />
              {errors.course && <p className="text-red-500">{errors.course}</p>}
            </div>

            <ValidationButton text="Ajouter une transaction" />
          </form>
          {errors.general && <p className="text-red-500">{errors.general}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default TransactionPage;
