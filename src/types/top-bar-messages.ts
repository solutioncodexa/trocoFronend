export interface TopBarMessageDTO {
  id: string;
  message: string;
  displayOrder: number;
  isActive: boolean;
  /** Secondes avant le message suivant quand plusieurs messages tournent */
  displayDurationSeconds: number;
  targetPaths?: string | null;
}

export interface CreateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
  targetPaths?: string | null;
}

export interface UpdateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
  targetPaths?: string | null;
}
