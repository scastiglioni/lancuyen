import GuardianRegistrationForm from "@/components/forms/GuardianRegistrationForm";

export default function RegisterGuardian() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-neutral-900">
            Sistema de Pagos Escolares
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Registro de Apoderados para gestionar pagos mensuales
          </p>
        </div>
        
        <GuardianRegistrationForm />
      </div>
    </div>
  );
}
