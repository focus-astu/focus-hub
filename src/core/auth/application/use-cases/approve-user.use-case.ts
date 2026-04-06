import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { ApproveUserDTO } from "@/core/auth/application/dtos/auth.dto"
import type { EmailService } from "@/core/shared/application/ports/email-service.port"
import { UserAlreadyApprovedError } from "@/core/auth/domain"
import { accountApprovedTemplate } from "@/core/shared/infrastructure/email/templates/account-approved.template"

export type ApproveUserDependencies = {
  authRepository: AuthRepository
  emailService?: EmailService
}

export const createApproveUserUseCase = (deps: ApproveUserDependencies) => {
  return async (dto: ApproveUserDTO): Promise<void> => {
    const isApproved = await deps.authRepository.isUserApproved(dto.userId)
    if (isApproved) {
      throw new UserAlreadyApprovedError(dto.userId)
    }

    await deps.authRepository.approveUser(dto.userId)

    if (deps.emailService) {
      const user = await deps.authRepository.getUserById(dto.userId)
      if (user) {
        const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
        const html = accountApprovedTemplate({
          userName: user.name,
          loginUrl: `${baseUrl}/login`,
        })

        await deps.emailService.send({
          to: user.email,
          subject: "Your Focus ASTU account has been approved",
          html,
        })
      }
    }
  }
}
