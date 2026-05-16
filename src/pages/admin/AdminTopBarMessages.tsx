import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoveUp,
  MoveDown,
  MessageSquare
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { TopBarMessageDTO, CreateTopBarMessageRequest, UpdateTopBarMessageRequest } from '@/types/top-bar-messages';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminTopBarMessages = () => {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<TopBarMessageDTO | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Récupérer tous les messages (admin)
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['top-bar-messages'],
    queryFn: () => topBarMessagesApi.getAllMessages(),
    retry: 3,
    retryDelay: 1000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: topBarMessagesApi.createMessage,
    onSuccess: (newMessage) => {
      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['top-bar-messages'], (old: any) => {
        const currentMessages = old || [];
        return [...currentMessages, newMessage];
      });
      
      // Invalider pour s'assurer que le serveur est synchronisé
      queryClient.invalidateQueries({ queryKey: ['top-bar-messages'] });
      
      toast.success('Message créé avec succès');
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('❌ Erreur création:', error);
      toast.error(error.message || 'Erreur lors de la création du message');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTopBarMessageRequest }) =>
      topBarMessagesApi.updateMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top-bar-messages'] });
      toast.success('Message mis à jour avec succès');
      setIsEditDialogOpen(false);
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du message');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: topBarMessagesApi.deleteMessage,
    onSuccess: (_, deletedId) => {
      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['top-bar-messages'], (old: any) => {
        const currentMessages = old || [];
        return currentMessages.filter((msg: any) => msg.id !== deletedId);
      });
      
      // Invalider pour s'assurer que le serveur est synchronisé
      queryClient.invalidateQueries({ queryKey: ['top-bar-messages'] });
      
      toast.success('Message supprimé avec succès');
    },
    onError: (error: any) => {
      console.error('❌ Erreur suppression:', error);
      toast.error(error.message || 'Erreur lors de la suppression du message');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      topBarMessagesApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top-bar-messages'] });
      toast.success('Statut du message mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du statut');
    },
  });

  const handleCreate = (data: CreateTopBarMessageRequest) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: UpdateTopBarMessageRequest) => {
    if (selectedMessage) {
      updateMutation.mutate({ id: selectedMessage.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive });
  };

  const moveMessage = (index: number, direction: 'up' | 'down') => {
    const newMessages = [...messages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newMessages.length) {
      // Échanger les positions
      const temp = newMessages[index].displayOrder;
      newMessages[index].displayOrder = newMessages[targetIndex].displayOrder;
      newMessages[targetIndex].displayOrder = temp;
      
      // Mettre à jour les deux messages en parallèle
      Promise.all([
        updateMutation.mutateAsync({ 
          id: newMessages[index].id, 
          data: { 
            message: newMessages[index].message,
            displayOrder: newMessages[index].displayOrder,
            isActive: newMessages[index].isActive,
            displayDurationSeconds: newMessages[index].displayDurationSeconds ?? 7,
          } 
        }),
        updateMutation.mutateAsync({ 
          id: newMessages[targetIndex].id, 
          data: { 
            message: newMessages[targetIndex].message,
            displayOrder: newMessages[targetIndex].displayOrder,
            isActive: newMessages[targetIndex].isActive,
            displayDurationSeconds: newMessages[targetIndex].displayDurationSeconds ?? 7,
          } 
        })
      ]).then(() => {
        toast.success('Ordre des messages mis à jour avec succès');
      }).catch((error) => {
        toast.error('Erreur lors de la mise à jour de l\'ordre');
        // Revenir à l'état précédent en cas d'erreur
        const tempBack = newMessages[index].displayOrder;
        newMessages[index].displayOrder = newMessages[targetIndex].displayOrder;
        newMessages[targetIndex].displayOrder = tempBack;
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Messages Top Bar" breadcrumbs={[{ label: 'Messages Top Bar' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Messages Top Bar" breadcrumbs={[{ label: 'Messages Top Bar' }]}>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Erreur de chargement</h3>
            <p className="text-red-600">
              Impossible de charger les messages. Veuillez réessayer.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Messages Top Bar" breadcrumbs={[{ label: 'Messages Top Bar' }]}>
      <div className="p-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages de la Top Bar</h1>
            <p className="text-muted-foreground mt-2">
              Gérez les messages et la durée d&apos;affichage avant passage au suivant (si plusieurs messages
              actifs), sur le même principe que la fermeture auto des promo modals.
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un message
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Messages Actifs</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total: {messages.length}</span>
                <span>Actifs: {messages.filter(m => m.isActive).length}</span>
                <span>Inactifs: {messages.filter(m => !m.isActive).length}</span>
              </div>
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun message trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créez votre premier message pour l'afficher dans la top bar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{message.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={message.isActive ? "default" : "secondary"}>
                          {message.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Ordre: {message.displayOrder}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Durée: {message.displayDurationSeconds ?? 7}s
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Position: {index + 1}/{messages.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveMessage(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveMessage(index, 'down')}
                        disabled={index === messages.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={message.isActive}
                          onCheckedChange={(checked) => handleToggleActive(message.id, checked)}
                        />
                        <Label className="sr-only">Actif</Label>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(message);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <CreateMessageDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        messages={messages}
      />

      {/* Edit Dialog */}
      <EditMessageDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        message={selectedMessage}
        onSubmit={handleUpdate}
      />
    </AdminLayout>
  );
};

// Dialog pour créer un message
const CreateMessageDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  messages
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTopBarMessageRequest) => void;
  messages: TopBarMessageDTO[];
}) => {
  const [formData, setFormData] = useState<CreateTopBarMessageRequest>({
    message: '',
    displayOrder: 1,
    isActive: true,
    displayDurationSeconds: 7,
  });

  useEffect(() => {
    if (!open) return;
    const orders = messages
      .map((m) => Number(m.displayOrder))
      .filter((n) => Number.isFinite(n));
    const maxOrder = orders.length > 0 ? Math.max(...orders) : 0;
    setFormData((prev) => ({
      ...prev,
      displayOrder: maxOrder + 1,
    }));
  }, [open, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Entrez le message à afficher"
              required
            />
          </div>

          <div>
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ordre actuel le plus élevé:{' '}
              {(() => {
                const orders = messages
                  .map((m) => Number(m.displayOrder))
                  .filter((n) => Number.isFinite(n));
                return orders.length > 0 ? Math.max(...orders) : 0;
              })()}
            </p>
          </div>

          <div>
            <Label htmlFor="displayDurationSeconds">Durée d&apos;affichage (secondes)</Label>
            <Input
              id="displayDurationSeconds"
              type="number"
              value={formData.displayDurationSeconds ?? 7}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayDurationSeconds: Math.min(600, Math.max(2, parseInt(e.target.value, 10) || 7)),
                })
              }
              min={2}
              max={600}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Temps pendant lequel ce message reste visible avant le suivant (si plusieurs messages actifs).
              Défaut: 7 s.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Actif</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog pour éditer un message
const EditMessageDialog = ({ 
  open, 
  onOpenChange, 
  message, 
  onSubmit 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: TopBarMessageDTO | null;
  onSubmit: (data: UpdateTopBarMessageRequest) => void;
}) => {
  const [formData, setFormData] = useState<UpdateTopBarMessageRequest>({
    message: message?.message || '',
    displayOrder: message?.displayOrder || 1,
    isActive: message?.isActive,
    displayDurationSeconds: message?.displayDurationSeconds ?? 7,
  });

  useEffect(() => {
    if (message) {
      setFormData({
        message: message.message,
        displayOrder: message.displayOrder,
        isActive: message.isActive,
        displayDurationSeconds: message.displayDurationSeconds ?? 7,
      });
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Entrez le message à afficher"
              required
            />
          </div>

          <div>
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-displayDurationSeconds">Durée d&apos;affichage (secondes)</Label>
            <Input
              id="edit-displayDurationSeconds"
              type="number"
              value={formData.displayDurationSeconds ?? 7}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayDurationSeconds: Math.min(600, Math.max(2, parseInt(e.target.value, 10) || 7)),
                })
              }
              min={2}
              max={600}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Avant passage au message suivant lorsque plusieurs messages sont actifs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Actif</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTopBarMessages;
