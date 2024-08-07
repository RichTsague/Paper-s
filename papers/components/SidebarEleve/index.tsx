"use client";

import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiBookOpen,
  HiUserAdd,
  HiUserGroup,
  HiCreditCard,
  HiCurrencyDollar,
} from "react-icons/hi";
import { FaBars } from "react-icons/fa";

export function SidebarEleve() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex max-md:z-10">
      {/* Sidebar for larger screens */}
      <div className="max-md:hidden md:flex">
        <Sidebar
          aria-label="Default sidebar example"
          className="sidebar-custom"
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/user/eleve" icon={HiHome}>
                Accueil
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/cours" icon={HiBookOpen}>
                Cours
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/mes_cours" icon={HiBookOpen}>
                Mes cours
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/tarifs" icon={HiCreditCard}>
                Les tarifs
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/cartes" icon={HiCreditCard}>
                Mes cartes
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Sidebar for smaller screens */}
      <div className="flex md:hidden flex-col w-20 transition-width duration-300">
        <Sidebar
          aria-label="Default sidebar example"
          className={`${
            isExpanded ? "w-44" : "w-20"
          } transition-width duration-300`}
        >
          <button className="p-1.5 focus:outline-none" onClick={toggleSidebar}>
            <FaBars className="text-xl" />
          </button>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/user/eleve" icon={HiHome}>
                {isExpanded && "Accueil"}
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/cours" icon={HiBookOpen}>
                {isExpanded && "Cours"}
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/mes_cours" icon={HiBookOpen}>
                {isExpanded && "Mes cours"}
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/tarifs" icon={HiCreditCard}>
                {isExpanded && "Les tarifs"}
              </Sidebar.Item>
              <Sidebar.Item href="/user/eleve/cartes" icon={HiCreditCard}>
                {isExpanded && "Mes cartes"}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </div>
  );
}

export default SidebarEleve;
