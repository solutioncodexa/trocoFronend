export interface TopBarMessageDTO {
  id: string;
  message: string;
  displayOrder: number;
  isActive: boolean;
  /** Secondes avant le message suivant quand plusieurs messages tournent */
  displayDurationSeconds: number;
}

export interface CreateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
}

export interface UpdateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
}
