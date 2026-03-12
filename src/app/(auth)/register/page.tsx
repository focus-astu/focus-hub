import { RegistrationForm } from "@/features/auth/components"
import Image from "next/image"
import registerimg from "../../../../public/assets/register-img.png"
import { CheckCircle, Info } from "lucide-react"

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 md:p-6">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex border border-slate-100">

        {/* LEFT SIDE: Brand Image & Info */}
        <div className="relative hidden lg:flex w-1/2 h-full ">
          <Image
            src={registerimg}
            alt="Focus ASTU"
            fill
            className="object-cover "
            priority
          />
          
          {/* Gradient Overlay for better text readability */}
          {/* <div className="absolute " /> */}

          <div className="relative z-10 flex flex-col justify-center p-12 text-white h-full">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md w-fit border border-white/20">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Focus ASTU</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Join the Focus ASTU <br/> Family
            </h2>

            <p className="text-white text-lg mb-8 max-w-md">
              A Christ-centered student fellowship at ASTU. Connect, grow, and serve together.
            </p>

            <div className="space-y-4">
              {[
                "Spiritual Growth & Mentorship",
                "Campus Fellowship & Events",
                "Biblical Teaching & Community"
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sm font-medium text-blue-50">
                  <div className=" p-1 rounded-full">
                    <CheckCircle size={16} className="text-blue-200" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form (Fixed Scrolling) */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white">
          <div className="w-full max-w-md mx-auto py-10 px-8">
            <div className="text-start  mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create Your Account
              </h1>
              <p className="text-slate-500 text-sm">
                Fill in the details below to join our community.
              </p>
            </div>

            <RegistrationForm />

            <div className="mt-5 pt-3 border-t border-slate-100">
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button className="text-[#2362eb] font-semibold hover:underline">
                  Login here
                </button>
              </p>

              <div className="mt-6 flex gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-800">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="leading-relaxed">
                  <strong>Notice:</strong> Your account will be pending until 
                  approved by an Admin. We'll email you once active.
                </p>
              </div>

              <p className="text-center text-xs text-slate-400 mt-8">
                © 2024 Focus ASTU Fellowship
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}