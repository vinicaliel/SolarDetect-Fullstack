import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-gray-700">
        <div>
          <h4 className="text-xl font-semibold text-green-700 mb-4">Equatorial+</h4>
          <p className="text-sm text-gray-600">
            Energia limpa e acessível para um futuro sustentável. Estamos
            presentes em todo o Brasil com compromisso e inovação.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Links Úteis</h4>
          <ul className="space-y-2">
            <li><Link href="/sobre" className="hover:text-green-700">Quem Somos</Link></li>
            <li><Link href="/atendimento" className="hover:text-green-700">Atendimento</Link></li>
            <li><Link href="/sustentabilidade" className="hover:text-green-700">Sustentabilidade</Link></li>
            <li><Link href="/contato" className="hover:text-green-700">Fale Conosco</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contato</h4>
          <p className="text-sm">📍 Brasília, DF</p>
          <p className="text-sm">📞 0800 123 4567</p>
          <p className="text-sm">✉️ contato@equatorial.com.br</p>
        </div>
      </div>
      <div className="text-center py-4 bg-gray-200 text-sm text-gray-600">
        © {new Date().getFullYear()} Equatorial+. Todos os direitos reservados.
      </div>
    </footer>
  );
}
