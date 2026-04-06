export type {
  RegisterDTO,
  ApproveUserDTO,
  RejectUserDTO,
  PendingUserResponseDTO,
  AllUsersResponseDTO,
  UserRoleInfo,
  ChangeRoleDTO,
} from "./dtos/auth.dto"

export type { AuthRepository } from "./ports/auth-repository.port"

export { createApproveUserUseCase } from "./use-cases/approve-user.use-case"
export type { ApproveUserDependencies } from "./use-cases/approve-user.use-case"

export { createRejectUserUseCase } from "./use-cases/reject-user.use-case"
export type { RejectUserDependencies } from "./use-cases/reject-user.use-case"

export { createGetPendingUsersUseCase } from "./use-cases/get-pending-users.use-case"
export type { GetPendingUsersDependencies } from "./use-cases/get-pending-users.use-case"

export { createGetAllUsersUseCase } from "./use-cases/get-all-users.use-case"
export type { GetAllUsersDependencies } from "./use-cases/get-all-users.use-case"

export { createChangeRoleUseCase, SuperAdminDemotionError, OrgNotFoundError } from "./use-cases/change-role.use-case"
export type { ChangeRoleDependencies } from "./use-cases/change-role.use-case"
