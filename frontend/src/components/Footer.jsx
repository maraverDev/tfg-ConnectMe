export default function Footer() {
  return (
    <footer className="bg-[#3F3B7C] text-white text-sm w-full mt-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">ConnectMe</span>. Todos los derechos
          reservados.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Términos
          </a>
          <a href="#" className="hover:underline">
            Privacidad
          </a>
          <a href="#" className="hover:underline">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
