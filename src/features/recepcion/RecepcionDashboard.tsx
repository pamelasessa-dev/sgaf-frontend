import { useNavigate } from "react-router-dom";

export default function RecepcionDashboard() {
  const navigate = useNavigate();

  return (
    <main className="space-y-8 bg-[#F2F8FB]">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#236B91] via-[#279EAA] to-[#54B8B0] p-7 text-white shadow-lg sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold tracking-wide text-white">
            🏢 SISTEMA DE GESTIÓN ACADÉMICA Y FINANCIERA
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Panel de Recepción
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
            ¡Bienvenido al SGAF! Desde este espacio podrás gestionar las
            solicitudes de registro y acompañar la atención administrativa de la
            institución.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#236B91] shadow-sm">
            ✨ Tu espacio de trabajo
          </div>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-24 right-36 h-64 w-64 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute bottom-7 right-8 hidden text-8xl opacity-20 lg:block">
          🏫
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#279EAA]">
            Navegación
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#192F4B]">
            Accesos principales
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Seleccioná una sección para comenzar a trabajar.
          </p>
        </div>

        <article className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:max-w-xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-3xl">
              👥
            </div>

            <span className="rounded-full bg-[#F2F8FB] px-3 py-1 text-xs font-semibold text-[#279EAA]">
              Acceso directo
            </span>
          </div>

          <h3 className="mt-5 text-xl font-bold text-[#192F4B]">
            Gestión de usuarios
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Consultar usuarios, revisar postulantes pendientes y gestionar sus
            estados de registro.
          </p>

          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E5F5F6] px-5 py-3 text-sm font-bold text-[#218C96] transition hover:bg-[#279EAA] hover:text-white"
          >
            Ver usuarios →
          </button>
        </article>
      </section>

      <section className="rounded-3xl border border-[#D9EBF1] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0D9] text-2xl">
            💡
          </div>

          <div>
            <h2 className="font-bold text-[#192F4B]">
              Información para recepción
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Desde la sección de usuarios podrás consultar las cuentas
              registradas, revisar postulantes y aprobar las solicitudes
              correspondientes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
