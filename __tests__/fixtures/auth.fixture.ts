import type { RegisterDTO, ApproveUserDTO, PendingUserResponseDTO } from "@/core/auth"
import { UserStatus } from "@/core/auth"

export const MOCK_REGISTER_DTO: RegisterDTO = {
  name: "Abebe Kebede",
  email: "abebe.kebede@astu.edu.et",
  password: "SecurePass123!",
  universityId: "UGR/1234/15",
  year: 3,
  department: "Software Engineering",
}

export const MOCK_APPROVE_USER_DTO: ApproveUserDTO = {
  userId: "user-pending-001",
  adminId: "admin-001",
}

export const MOCK_PENDING_USER: PendingUserResponseDTO = {
  id: "user-pending-001",
  name: "Abebe Kebede",
  email: "abebe.kebede@astu.edu.et",
  universityId: "UGR/1234/15",
  year: 3,
  department: "Software Engineering",
  emailVerified: true,
  status: UserStatus.EMAIL_VERIFIED,
  createdAt: "2026-03-01T10:00:00.000Z",
}

export const MOCK_PENDING_USERS_LIST: PendingUserResponseDTO[] = [
  MOCK_PENDING_USER,
  {
    id: "user-pending-002",
    name: "Tigist Hailu",
    email: "tigist.hailu@astu.edu.et",
    universityId: "UGR/5678/15",
    year: 2,
    department: "Computer Science",
    emailVerified: true,
    status: UserStatus.EMAIL_VERIFIED,
    createdAt: "2026-03-02T14:30:00.000Z",
  },
]
