import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { FirebaseError } from "firebase/app";


export const firestoreUpdateDocument = async (collectionName: string, documentID: string, data: any) => {
    try {
        const documentRef = doc(db, collectionName, documentID);

        await updateDoc(documentRef, data);
        return { data: true};
    } catch (error) {
        const firebaseError = error as FirebaseError;
        //
        return{
            error: {
                code: firebaseError.code,
                message: firebaseError.message,
            },
        };
    }
};