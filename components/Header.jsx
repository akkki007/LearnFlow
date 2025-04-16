"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Playground", href: "/playground" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(""); // "admin", "student", or "teacher"

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      setIsAuthenticated(true);
  
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role); // "admin", "student", or "teacher"
      } catch (error) {
        console.error("Failed to decode JWT from localStorage", error);
      }
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear the token from localStorage
    setIsAuthenticated(false);
    setRole("");
    router.push("/"); // Redirect to home
  };
  
  const renderDashboardLink = () => {
    switch (role) {
      case "admin":
        return (
          <Link
            href="/admin"
            className="text-md/6 poppins-semibold font-semibold text-green-600 hover:text-green-800"
            prefetch={false} // Disable prefetching for this link
          >
            Admin Dashboard
          </Link>
        );
      case "student":
        return (
          <Link
            href="/student"
            className="text-md/6 poppins-semibold font-semibold text-green-600 hover:text-green-800"
          >
            Student Dashboard
          </Link>
        );
      case "teacher":
        return (
          <Link
            href="/teacher"
            className="text-md/6 poppins-semibold font-semibold text-green-600 hover:text-green-800"
          >
            Teacher Dashboard
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <header className="absolute inset-x-0 top-[-5%] z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5" prefetch={true}>
            <Image src="/logo.png" alt="learnflow" width={160} height={40} className="h-40 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className="text-md poppins-regular hover:text-green-600 hover:transition-all hover:scale-110 font-semibold text-gray-900 transition-transform duration-300 ease-in-out"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:gap-5 lg:mr-14 lg:justify-end">
          {!isAuthenticated ? (
            <>
              <Link
                href="/register"
                className="text-md/6 poppins-semibold font-semibold text-zinc-600 hover:text-zinc-900"
                prefetch={true}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                prefetch={true}
                className="text-md/6 poppins-semibold font-semibold text-zinc-600 hover:text-zinc-900"
              >
                Log in
              </Link>
            </>
          ) : (
            <>
              {renderDashboardLink()}
              <button
                onClick={handleLogout}
                className="text-md/6 poppins-semibold font-semibold text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" prefetch={true}>
              <Image
                src="/logo.png"
                alt="EduForge"
                width={160}
                height={40}
                className="h-40 w-auto"
                priority={true}
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    prefetch={true} 
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block hover:text-green-600 rounded-lg px-3 py-2 text-base/7 poppins-regular font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 flex flex-col gap-y-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/register"
                      className="text-md/6 poppins-semibold font-semibold text-gray-900"
                      prefetch={true}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/login"
                      prefetch={true}
                      className="text-md/6 poppins-semibold font-semibold text-gray-900"
                    >
                      Log in
                    </Link>
                  </>
                ) : (
                  <>
                    {renderDashboardLink()}
                    <button
                      onClick={handleLogout}
                      className="text-md/6 poppins-semibold font-semibold text-red-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
