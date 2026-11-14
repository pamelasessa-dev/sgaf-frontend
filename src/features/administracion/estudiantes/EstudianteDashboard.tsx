export default function EstudianteDashboard() {
  return (
    <main className="space-y-8">
      {/* Bienvenida */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#192F4B] via-[#236B91] to-[#279EAA] p-8 text-white shadow-lg sm:p-10">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-[#A9DDBD]/20" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
            SGAF · Espacio del estudiante
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            ¡Bienvenido al panel del estudiante!
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
            Este es tu espacio académico. Desde aquí podrás consultar tu
            información personal, mantenerte al día con tus actividades y
            acceder a los servicios del sistema.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
              🎓
            </div>
            <div>
              <p className="font-semibold">Tu camino académico</p>
              <p className="text-sm text-white/75">
                Todo lo que necesitas, en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accesos informativos */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#192F4B]">
            Tu espacio académico
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Conoce las principales áreas disponibles en el sistema.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-[#BDE8F1] bg-[#DFF3FA] p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#279EAA] text-2xl text-white shadow-sm">
              👤
            </div>
            <h3 className="mt-5 font-bold text-[#192F4B]">Mi perfil</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consulta tus datos personales, información académica y datos de
              contacto de tu tutor.
            </p>
          </article>

          <article className="rounded-2xl border border-[#A9DDBD] bg-[#DDF3E5] p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#328456] text-2xl text-white shadow-sm">
              📚
            </div>
            <h3 className="mt-5 font-bold text-[#192F4B]">Mis estudios</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Mantén organizada tu información académica y consulta tus
              matrículas.
            </p>
          </article>

          <article className="rounded-2xl border border-[#EDE7FA] bg-[#EDE7FA] p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7962A8] text-2xl text-white shadow-sm">
              💻
            </div>
            <h3 className="mt-5 font-bold text-[#192F4B]">Aula virtual</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Accede a tu espacio de aprendizaje y mantente al tanto de tus
              actividades.
            </p>
          </article>

          <article className="rounded-2xl border border-[#F5D9AD] bg-[#FFF0D9] p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C17A28] text-2xl text-white shadow-sm">
              💳
            </div>
            <h3 className="mt-5 font-bold text-[#192F4B]">Finanzas</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consulta la información relacionada con tus obligaciones y pagos
              académicos.
            </p>
          </article>

          <article className="rounded-2xl border border-[#F3E6A5] bg-[#FFF6C9] p-6 transition-transform duration-200 hover:-translate-y-1 sm:col-span-2 xl:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6A62B] text-2xl text-white shadow-sm">
                ⭐
              </div>
              <div>
                <h3 className="font-bold text-[#192F4B]">
                  ¡Tu educación es lo importante!
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Utiliza las herramientas del SGAF para seguir tu progreso y
                  mantener tu información actualizada.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Mensaje final */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF3E5] text-xl">
            🌱
          </div>
          <div>
            <h2 className="font-bold text-[#192F4B]">Cada paso cuenta</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Te deseamos muchos éxitos en tu recorrido académico. El equipo del
              SGAF está para acompañarte.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
