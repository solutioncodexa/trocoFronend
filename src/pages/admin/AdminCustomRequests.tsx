import { useState } from 'react';
import { Eye, Search, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { mockCustomRequests } from '@/data/adminMockData';
import { CustomFabricationRequest } from '@/types/product';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState<CustomFabricationRequest[]>(mockCustomRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CustomFabricationRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[status] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      contacted: 'Contacté',
      completed: 'Terminée',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bracelet: 'Bracelet',
      ring: 'Bague',
      necklace: 'Collier',
      earrings: "Boucles d'oreilles",
      set: 'Parure',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const handleViewRequest = (request: CustomFabricationRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status: newStatus as CustomFabricationRequest['status'] }
          : r
      )
    );
    toast.success(`Statut de la demande ${requestId} mis à jour`);
    
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: newStatus as CustomFabricationRequest['status'] } : null);
    }
  };

  const handleSaveNotes = (requestId: string) => {
    toast.success('Notes enregistrées');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout title="Demandes de Personnalisation" breadcrumbs={[{ label: 'Personnalisations' }]}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['pending', 'contacted', 'completed'].map(status => {
          const count = requests.filter(r => r.status === status).length;
          return (
            <div key={status} className="bg-card rounded-lg p-4 border border-border">
              <Badge className={cn('mb-2', getStatusStyle(status))}>
                {getStatusLabel(status)}
              </Badge>
              <p className="font-display text-2xl">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID, nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="contacted">Contacté</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-video">
              <img
                src={request.imageUrl}
                alt="Modèle"
                className="w-full h-full object-cover"
              />
              <Badge className={cn('absolute top-2 right-2', getStatusStyle(request.status))}>
                {getStatusLabel(request.status)}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-body font-medium">{request.customer.fullName}</p>
                  <p className="font-body text-xs text-muted-foreground">{request.id}</p>
                </div>
                <Badge variant="outline">
                  {getTypeLabel(request.type)}
                </Badge>
              </div>

              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{request.style}</span>
                <span>•</span>
                <span>{request.weight}g estimé</span>
              </div>

              <p className="font-body text-sm text-muted-foreground line-clamp-2">
                {request.description}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewRequest(request)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Détails
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`tel:${request.customer.phone}`}>
                    <Phone className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-card rounded-lg p-8 text-center border border-border">
          <p className="font-body text-muted-foreground">Aucune demande trouvée</p>
        </div>
      )}

      {/* Request Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Demande {selectedRequest?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={selectedRequest.imageUrl}
                  alt="Modèle"
                  className="w-full h-full object-contain"
                />
                <a
                  href={selectedRequest.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-2 bg-charcoal/80 text-cream rounded-lg hover:bg-charcoal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Status and Type */}
              <div className="flex items-center gap-3">
                <Badge className={cn('text-sm', getStatusStyle(selectedRequest.status))}>
                  {getStatusLabel(selectedRequest.status)}
                </Badge>
                <Badge variant="outline">{getTypeLabel(selectedRequest.type)}</Badge>
                <Badge variant="secondary" className="capitalize">{selectedRequest.style}</Badge>
                <span className="font-body text-sm text-muted-foreground">
                  ~{selectedRequest.weight}g
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-display text-lg">Informations client</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-body font-medium">{selectedRequest.customer.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${selectedRequest.customer.phone}`}
                      className="font-body text-primary hover:underline"
                    >
                      {selectedRequest.customer.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedRequest.customer.email}`}
                      className="font-body text-primary hover:underline"
                    >
                      {selectedRequest.customer.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-display text-lg mb-2">Description du projet</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-display text-lg mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Notes internes
                </h3>
                <Textarea
                  placeholder="Ajouter des notes sur cette demande..."
                  value={adminNotes[selectedRequest.id] || ''}
                  onChange={(e) => setAdminNotes(prev => ({
                    ...prev,
                    [selectedRequest.id]: e.target.value
                  }))}
                  rows={3}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => handleSaveNotes(selectedRequest.id)}
                >
                  Enregistrer les notes
                </Button>
              </div>

              {/* Date */}
              <p className="font-body text-sm text-muted-foreground">
                Reçue le {formatDate(selectedRequest.createdAt)}
              </p>

              {/* Actions */}
              <DialogFooter className="flex-col sm:flex-row gap-3">
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => handleStatusChange(selectedRequest.id, value)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="contacted">Contacté</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedRequest.customer.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`mailto:${selectedRequest.customer.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomRequests;
