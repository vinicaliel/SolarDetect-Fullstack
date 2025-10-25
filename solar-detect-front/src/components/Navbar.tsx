"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Início", href: "/" },
    { name: "Quem Somos", href: "/sobre" },
    { name: "Sustentabilidade", href: "/sustentabilidade" },
    { name: "Atendimento", href: "/atendimento" },
    { name: "Fale Conosco", href: "/contato" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-700">
          Equatorial<span className="text-blue-600">+</span>
        </Link>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-green-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {open && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
            <ul className="flex flex-col p-4 gap-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-gray-700 hover:text-green-700"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
