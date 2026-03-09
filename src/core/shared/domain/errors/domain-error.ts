export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = "DomainError"
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`, "ENTITY_NOT_FOUND")
    this.name = "EntityNotFoundError"
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}
