import { Button } from "./Button";

export function Navbar() {
  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-700">Solar Detect</div>
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#home" className="hover:text-green-700 transition-colors duration-300">Home</a>
          <a href="#features" className="hover:text-green-700 transition-colors duration-300">Como Funciona</a>
          <a href="#cards" className="hover:text-green-700 transition-colors duration-300">Funcionalidades</a>
          <a href="#contact" className="hover:text-green-700 transition-colors duration-300">Contato</a>
          <Button variant="outline" size="sm">Login</Button>
          <Button size="sm">Cadastro</Button>
        </div>
      </div>
    </nav>
  );
}
