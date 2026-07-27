// src/domain/ports/application-repository.port.ts
// Port definition matching IApplicationRepository for backwards compatibility and clean architecture compliance.

import type { IApplicationRepository } from './IApplicationRepository';

export type { IApplicationRepository as ApplicationRepositoryPort };
export * from './IApplicationRepository';
