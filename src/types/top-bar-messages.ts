export interface TopBarMessageDTO {
  id: string;
  message: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateTopBarMessageRequest {
  message: string;
  displayOrder: number;
  isActive?: boolean;
}
