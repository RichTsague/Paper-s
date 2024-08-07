"use client";

import React, { useState } from "react";
import { Sidebar, Navbar } from "flowbite-react";
import {
  HiHome,
  HiBookOpen,
  HiUserAdd,
  HiUserGroup,
  HiCreditCard,
  HiCurrencyDollar,
  HiPlusCircle,
} from "react-icons/hi";
import { FaBars, FaUserEdit } from "react-icons/fa"; // Ajouter FaUserEdit pour les icônes de modification

export function SidebarAdmin() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex max-md:z-10">
      {/* Sidebar for larger screens */}
      <div className="max-sm:hidden sm:flex">
        <Sidebar aria-label="Default sidebar example">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/user/admin" icon={HiHome}>
                Accueil
              </Sidebar.Item>
              <Sidebar.Collapse icon={HiBookOpen} label="Cours">
                <Sidebar.Item
                  href="/user/admin/creation_cours"
                  icon={HiPlusCircle}
                >
                  Créer un cours
                </Sidebar.Item>
                <Sidebar.Item href="/user/admin/liste_cours" icon={HiBookOpen}>
                  Liste des cours
                </Sidebar.Item>
              </Sidebar.Collapse>

              <Sidebar.Collapse icon={HiUserGroup} label="Professeur">
                <Sidebar.Item
                  href="/user/admin/creation_professeur"
                  icon={HiUserAdd}
                >
                  Créer un professeur
                </Sidebar.Item>
                <Sidebar.Item
                  href="/user/admin/list_professeur"
                  icon={HiUserGroup}
                >
                  Liste des professeurs
                </Sidebar.Item>
                <Sidebar.Item
                  href="/user/admin/modifier_prof"
                  icon={FaUserEdit}
                >
                  {" "}
                  Modifier professeur
                </Sidebar.Item>
              </Sidebar.Collapse>

              <Sidebar.Collapse icon={HiUserGroup} label="Elève">
                <Sidebar.Item
                  href="/user/admin/creation_eleve"
                  icon={HiUserAdd}
                >
                  Créer un élève
                </Sidebar.Item>
                <Sidebar.Item href="/user/admin/list_eleve" icon={HiUserGroup}>
                  Liste des élèves
                </Sidebar.Item>
                <Sidebar.Item
                  href="/user/admin/modifier_eleve"
                  icon={FaUserEdit}
                >
                  {" "}
                  Modifier élève
                </Sidebar.Item>
              </Sidebar.Collapse>

              <Sidebar.Collapse icon={HiCreditCard} label="Tarif">
                <Sidebar.Item
                  href="/user/admin/creation_tarif"
                  icon={HiPlusCircle}
                >
                  Créer un tarif
                </Sidebar.Item>
                <Sidebar.Item
                  href="/user/admin/liste_tarif"
                  icon={HiCreditCard}
                >
                  Liste des tarifs
                </Sidebar.Item>
              </Sidebar.Collapse>

              <Sidebar.Item
                href="/user/admin/comptabilite"
                icon={HiCurrencyDollar}
              >
                Comptabilité
              </Sidebar.Item>

              <Sidebar.Item
                href="/user/admin/transaction"
                icon={HiCurrencyDollar}
              >
                Transaction
              </Sidebar.Item>

              {/* <Sidebar.Item
                href="/user/admin/modifier_contact"
                icon={HiCurrencyDollar}
              >
                Modifier contact
              </Sidebar.Item> */}
              <Sidebar.Item href="/user/admin/creation_admin" icon={HiUserAdd}>
                Création admin
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Sidebar for smaller screens */}
      <div className="flex sm:hidden w-full transition-width duration-300 font-semibold">
        <Navbar id="sidebar" className="bg-c4 p-4 w-full" fluid>
          <Navbar.Brand>
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Menu
            </span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="w-full text-center">
            <Navbar.Link href="/user/admin">Accueil</Navbar.Link>
            <Navbar.Collapse aria-label="Cours">
              <Navbar.Link href="/user/admin/creation_cours">
                Créer un cours
              </Navbar.Link>
              <Navbar.Link href="/user/admin/liste_cours">
                Liste des cours
              </Navbar.Link>
            </Navbar.Collapse>
            <Navbar.Collapse aria-label="Professeur">
              <Navbar.Link href="/user/admin/creation_professeur">
                Créer un professeur
              </Navbar.Link>
              <Navbar.Link href="/user/admin/list_professeur">
                Liste des professeur
              </Navbar.Link>
              <Navbar.Link href="/user/admin/modifier_prof">
                Modifier un professeur
              </Navbar.Link>
            </Navbar.Collapse>
            <Navbar.Collapse aria-label="Elève">
              <Navbar.Link href="/user/admin/creation_eleve">
                Créer un élève
              </Navbar.Link>
              <Navbar.Link href="/user/admin/list_eleve">
                Liste des élève
              </Navbar.Link>
              <Navbar.Link href="/user/admin/modifier_eleve">
                Modifier un élève
              </Navbar.Link>
            </Navbar.Collapse>
            <Navbar.Collapse aria-label="Tarifs">
              <Navbar.Link href="/user/admin/creation_tarif">
                Créer un tarif
              </Navbar.Link>
              <Navbar.Link href="/user/admin/liste_tarif">
                Liste des tarifs
              </Navbar.Link>
            </Navbar.Collapse>
            <Navbar.Collapse aria-label="Autre">
              <Navbar.Link href="/user/admin/comptabilite">
                Comptabilité
              </Navbar.Link>
              <Navbar.Link href="/user/admin/transaction">
                Ajouter une transaction
              </Navbar.Link>
              <Navbar.Link href="/user/admin/creation_admin">
                Créer un administrateur
              </Navbar.Link>
            </Navbar.Collapse>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

export default SidebarAdmin;
