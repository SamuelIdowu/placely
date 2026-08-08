// src/application/student/toggle-save-listing.ts

import type { ISavedListingRepository } from '@/domain/ports/ISavedListingRepository';

export interface ToggleSaveListingCommand {
  studentProfileId: string;
  listingId: string;
}

export class ToggleSaveListingUseCase {
  constructor(private readonly savedListingRepo: ISavedListingRepository) {}

  async execute(command: ToggleSaveListingCommand): Promise<{ isSaved: boolean }> {
    const currentlySaved = await this.savedListingRepo.isSaved(
      command.studentProfileId,
      command.listingId
    );

    if (currentlySaved) {
      await this.savedListingRepo.remove(command.studentProfileId, command.listingId);
      return { isSaved: false };
    } else {
      await this.savedListingRepo.save(command.studentProfileId, command.listingId);
      return { isSaved: true };
    }
  }
}
