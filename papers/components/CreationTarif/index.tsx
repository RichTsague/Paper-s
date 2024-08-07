import React from "react";
import ValidationButton from "../ValidationButton";

interface CreationTarifProps {
  titre: string;
  setTitre: (titre: string) => void;
  description: string;
  setDescription: (description: string) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  prix: number;
  setPrix: (prix: number) => void;
  credit: number;
  setCredit: (credit: number) => void;
  lienPaiement: string;
  setLienPaiement: (lienPaiement: string) => void;
  handleSubmit: () => void;
}

const CreationTarif: React.FC<CreationTarifProps> = ({
  titre,
  setTitre,
  description,
  setDescription,
  image,
  setImage,
  prix,
  setPrix,
  credit,
  setCredit,
  lienPaiement,
  setLienPaiement,
  handleSubmit,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md ">
      <h1 className="text-center  font-semibold text-2xl mb-6">
        Créer un tarif
      </h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titre">Titre</label> */}
          <input
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          {/* <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label> */}
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Description"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm  mb-2" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Image"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm  mb-2" htmlFor="prix">
            Prix
          </label>
          <input
            id="prix"
            type="number"
            value={prix}
            onChange={(e) => setPrix(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Prix"
            min={0}
            max={1999}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm  mb-2" htmlFor="credit">
            Crédit
          </label>
          <input
            id="credit"
            type="number"
            value={credit}
            onChange={(e) => setCredit(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Crédit"
            min={1}
            max={99}
          />
        </div>
        <div>
          {/* <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lienPaiement"
          >
            Lien de Paiement
          </label> */}
          <input
            id="lienPaiement"
            type="text"
            value={lienPaiement}
            onChange={(e) => setLienPaiement(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Lien de Paiement"
          />
        </div>
        <ValidationButton text="Créer un Tarif" />
      </form>
    </div>
  );
};

export default CreationTarif;
