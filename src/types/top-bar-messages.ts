export interface TopBarMessageDTO {
  id: string;
  message: string;
  displayOrder: number;
  isActive: boolean;
  /** Secondes avant le message suivant quand plusieurs messages tournent */
  displayDurationSeconds: number;
  targetPaths?: string | null;
  /** Fond hex (vide/null = dégradé thème) */
  backgroundColor?: string | null;
  /** Texte hex (vide/null = texte thème) */
  textColor?: string | null;
}

export interface CreateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
  targetPaths?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
}

export interface UpdateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
  displayDurationSeconds?: number;
  targetPaths?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
}
