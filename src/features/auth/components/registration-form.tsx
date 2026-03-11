"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button } from "@/components/ui"
import { authClient } from "@/lib/auth-client"
import {
  RegistrationValidationResult,
  validateRegistration,
} from "@/lib/validations/auth.validation"
import { RegisterUserDTO } from "../../../core/auth/application/dtos/user.dto"
import { Info } from "lucide-react"

export const RegistrationForm = () => {
  const router = useRouter()

  const [errors, setErrors] = useState<RegistrationValidationResult["errors"]>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // const handleSubmit = async (formData: FormData) => {
  //   setServerError(null)

  //   const input: RegisterUserDTO = {
  //     fullName: (formData.get("fullName") as string) || "",
  //     email: (formData.get("email") as string) || "",
  //     universityId: (formData.get("universityId") as string) || "",
  //     year: formData.get("year") as unknown as number,
  //     department: (formData.get("department") as string) || undefined,
  //     password: (formData.get("password") as string) || "",
  //     confirmPassword: (formData.get("confirmPassword") as string) || "",
  //   }

  //   const { valid, errors: validationErrors } = validateRegistration(input)

  //   if (!valid) {
  //     setErrors(validationErrors)
  //     return
  //   }

  //   setIsSubmitting(true)

  //   const { data, error } = await authClient.signUp.email({ ...})

  //   setIsSubmitting(false)

  //   if (error) {
  //     setServerError(error.message || "Something went wrong")
  //     return
  //   }

  //   router.push("/verify-email?sent=true")
  // }

  return (
    <form className="space-y-2">

      {/* FULL NAME */}
      <Input
        name="fullName"
        label="Full Name"
        placeholder="John Doe"
        arial-label="Full Name"
        error={errors.fullName}
        required
        className="border-none bg-[#f8fafc]"
      />

      {/* EMAIL */}
      <Input
        name="email"
        type="email"
        label="Email (required)"
        arial-label="Email"
        placeholder="example@astu.edu.et"
        error={errors.email}
        required
        className="border-none bg-[#f8fafc]"

      />

      {/* phone number */}
      <Input
        name="Phone Number"
        label="Phone Number"
        arial-label="Phone Number"
        placeholder="+251..."
        error={errors.phoneNumber}
        className="border-none bg-[#f8fafc]"
      />

      {/* PASSWORD */}
      <Input
        name="password"
        type="password"
        label="Password (required)"
        arial-label="Password"
        placeholder="••••••••"
        error={errors.password}
        required
        className="border-none bg-[#f8fafc]"

      />

      {/* CONFIRM PASSWORD */}

      <Input
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        arial-label="Confirm Password"
        placeholder="••••••••"
        error={errors.confirmPassword}
        required
        className="border-none bg-[#f8fafc]"
      />

       

      {/* YEAR + UNIVERSITY ID */}
      <div className="grid grid-cols-2 gap-2">
        <Input
          name="year"
          label="Year"
          arial-label="Year"
          placeholder="1st Year"
          error={errors.year}
          required
          className="border-none bg-[#f8fafc]"
        />

        <Input
          name="universityId"
          label="University ID"
          arial-label="University ID"
          placeholder="UGR/12345"
          error={errors.universityId}

          required
          className="border-none bg-[#f8fafc]"
        />
      </div>

     

      {/* DEPARTMENT */}
      <Input
        name="department"
        label="Department (optional)"
        arial-label="Department"
        placeholder="Software Engineering"
        error={errors.department}
        className="border-none bg-[#f8fafc]"
      />



      {/* SERVER ERROR */}
      {serverError && (
        <p className="text-sm text-red-600">{serverError}</p>
      )}

      {/* BUTTON */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full h-11 mt-5  !text-white !bg-[#2362eb] hover:bg-blue-200 !rounded-2xl"
      >
        Create Account
      </Button>


    </form>
  )
}