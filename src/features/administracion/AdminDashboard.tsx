import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#BDE8F1] bg-gradient-to-r from-[#DFF3FA] via-[#E9F7FA] to-[#DDF3E5] p-6 shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A9DDBD] bg-white/80 px-3 py-1 text-xs font-semibold text-[#328456]">
            <span className="h-2 w-2 rounded-full bg-[#48A875]" />
            Panel de administración
          </span>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#192F4B] sm:text-3xl">
            Bienvenido al SGAF
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Gestiona los accesos y usuarios del sistema desde este espacio
            administrativo.
          </p>

          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="mt-6 rounded-xl bg-[#279EAA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#218A95] hover:shadow-md"
          >
            Administrar usuarios
          </button>
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/40"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 right-28 h-64 w-64 rounded-full bg-[#A9DDBD]/40 blur-2xl"
        />
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#192F4B]">
            Gestión del sistema
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Módulos disponibles para tu perfil.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/usuarios")}
          className="group flex min-h-52 w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#BDE8F1] hover:shadow-lg sm:max-w-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DFF3FA] text-2xl text-[#23849A] transition-transform group-hover:scale-110">
            👥
          </div>

          <h3 className="mt-5 text-base font-bold text-[#192F4B] group-hover:text-[#279EAA]">
            Usuarios
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
            Consultar, aprobar postulantes y administrar los usuarios
            registrados en el sistema.
          </p>

          <span className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-[#279EAA]">
            Gestionar usuarios →
          </span>
        </button>
      </section>

      <section className="rounded-2xl border border-[#F5D7A8] bg-gradient-to-r from-[#FFF6C9] via-[#FFF9E8] to-[#FFF0D9] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            ℹ️
          </div>

          <div>
            <h2 className="font-semibold text-[#80691F]">
              Centro de administración
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#80691F]/90">
              Desde aquí podrás supervisar los usuarios y las solicitudes de
              registro. Los demás módulos se incorporarán progresivamente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
