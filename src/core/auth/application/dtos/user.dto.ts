

export type RegisterUserDTO = {
  fullName: string
  email: string
  universityId: string
  year: number | string
  department?: string
  password: string
  confirmPassword: string
}

export type LoginUserDTO = {
  email: string
  password: string
}

export type UserResponse = {
   
}