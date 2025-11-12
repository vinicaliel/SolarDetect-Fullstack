export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-lg font-bold mb-4 md:mb-0">Solar Detect</div>

        <div className="flex flex-col md:flex-row gap-6">
          <a
            href="#home"
            className="hover:text-green-500 transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="#cards"
            className="hover:text-green-500 transition-colors duration-300"
          >
            Funcionalidades
          </a>
          <a
            href="https://github.com/vinicaliel/SolarDetect-Fullstack"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition-colors duration-300"
          >
            Contato
          </a>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          &copy; 2025 Solar Detect. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
