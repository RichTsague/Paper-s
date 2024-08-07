"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Navbar, Popover } from "flowbite-react";
import Image from "next/image";
import Logo from "@/public/Logo-150x150.jpg";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar_() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name);
            setUserFirstName(userData.firstName);
            setUserStatus(userData.status);
            if (userData.status === "professeur" && userData.photoURL) {
              setPhotoURL(userData.photoURL);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      } else {
        console.log("User not logged in or no user found");
        setUserName(null);
        setUserFirstName(null);
        setUserStatus(null);
        setPhotoURL(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login"); // Redirige vers la page de connexion après la déconnexion
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error.message);
    }
  };

  const getHomeLink = () => {
    if (userStatus === "admin") {
      return "/user/admin";
    } else if (userStatus === "professeur") {
      return "/user/professeur";
    } else if (userStatus === "eleve") {
      return "/user/eleve";
    } else {
      return "/";
    }
  };

  const getCoursesLink = () => {
    if (userStatus === "admin") {
      return "/user/admin/cours";
    } else if (userStatus === "professeur") {
      return "/user/professeur/cours";
    } else if (userStatus === "eleve") {
      return "/user/eleve/cours";
    } else {
      return "/user/visiteur/cours";
    }
  };

  const getTarifsLink = () => {
    if (userStatus === "admin") {
      return "/user/admin/tarifs";
    } else if (userStatus === "professeur") {
      return "/user/professeur/tarifs";
    } else if (userStatus === "eleve") {
      return "/user/eleve/tarifs";
    } else {
      return "/user/visiteur/tarifs";
    }
  };

  const getContactLink = () => {
    if (userStatus === "admin") {
      return "/user/admin/contact";
    } else if (userStatus === "professeur") {
      return "/user/professeur/contact";
    } else if (userStatus === "eleve") {
      return "/user/eleve/contact";
    } else {
      return "/user/visiteur/contact";
    }
  };

  return (
    <Navbar className="sticky top-0 p-4 w-full bg-c2 text-c3 z-50" fluid>
      <Navbar.Brand href={getHomeLink()}>
        <Image src={Logo} width={75} height={75} alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-c3 ml-4">
          The Dance Lab
        </span>
      </Navbar.Brand>
      <div className="flex md:hidden items-center">
        <Navbar.Toggle />
      </div>
      <div className="hidden md:flex md:order-3 items-center ml-auto">
        {loading ? (
          <span className="text-gray-400">Chargement</span>
        ) : userName && userFirstName ? (
          <>
            {userStatus === "professeur" && photoURL && (
              <Image
                src={photoURL}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mr-4"
              />
            )}
            <Popover
              aria-labelledby="default-popover"
              content={
                <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                  <div className="  bg-c4 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                    <h3
                      id="default-popover"
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      Compte
                    </h3>
                  </div>
                  <div className="px-3 py-2 bg-white-egg ">
                    <span className="flex self-center whitespace-nowrap text-xl font-semibold dark:text-white ml-4 max-md:hidden">
                      {userFirstName} {userName}
                    </span>
                  </div>
                </div>
              }
              trigger="hover"
            >
              <Button className="bg-c5">Profil</Button>
            </Popover>
            <Button
              className="ml-4 bg-c6 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </>
        ) : (
          <Button className="ml-4 bg-c5" href="/auth/login">
            Se connecter
          </Button>
        )}
      </div>
      <Navbar.Collapse className="md:flex md:justify-center md:order-2 w-full text-center">
        {loading ? (
          <span className="text-gray-400"></span>
        ) : userName && userFirstName ? (
          <div className="flex flex-col items-center justify-center md:hidden mb-4">
            {userStatus === "professeur" && photoURL && (
              <Image
                src={photoURL}
                alt="Profil"
                width={40}
                height={40}
                className="rounded-full mb-2"
              />
            )}
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {userFirstName} {userName}
            </span>
          </div>
        ) : null}
        <Navbar.Link className="text-c3 md:ml-5" href={getHomeLink()}>
          Accueil
        </Navbar.Link>
        <Navbar.Link className="text-c3" href={getCoursesLink()}>
          Cours
        </Navbar.Link>
        <Navbar.Link className="text-c3" href={getTarifsLink()}>
          Tarifs
        </Navbar.Link>
        <Navbar.Link className="text-white-egg" href={getContactLink()}>
          Contact
        </Navbar.Link>
        {!loading && !userName && !userFirstName && (
          <Button className="md:hidden mt-4 bg-c5" href="/auth/login">
            Se connecter
          </Button>
        )}
        {!loading && userName && userFirstName && (
          <Button
            className="mt-4 bg-c6 hover:bg-red-700 text-white md:hidden"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navbar_;
