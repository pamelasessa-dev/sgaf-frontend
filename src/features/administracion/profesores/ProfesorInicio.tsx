export default function ProfesorInicio() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#192F4B] to-[#279EAA] p-8 text-white shadow-sm">
        <p className="text-sm font-medium text-white/80">
          Sistema de Gestión Académica y Financiera
        </p>

        <h1 className="mt-3 text-3xl font-bold">Panel del profesor</h1>

        <p className="mt-2 max-w-2xl text-sm text-white/90">
          Bienvenido al SGAF. Desde aquí podrás acceder a las herramientas
          correspondientes a tu actividad docente.
        </p>
      </section>

      <section className="rounded-2xl border border-[#BDE8F1] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DFF3FA] text-2xl">
            📚
          </div>

          <div>
            <h2 className="font-semibold text-[#192F4B]">Espacio docente</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tu espacio de trabajo académico estará disponible aquí.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
