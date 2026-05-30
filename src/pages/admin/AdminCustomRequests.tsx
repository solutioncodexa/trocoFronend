import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Eye, Search, Phone, Mail, MessageSquare, ExternalLink, FileText, Calculator, Check, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { customOrdersApi, getImageUrl } from '@/services/api';
import { CustomOrderDTO, CustomOrderListItemDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { cn } from '@/lib/utils';
import QuoteDialog, { QuoteData } from '@/components/admin/QuoteDialog';

const AdminCustomRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get('id');
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CustomOrderDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterStatusChange = useCallback((status: string) => {
    setFilterStatus(status);
    setPage(0);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const { data: requestsPage, isLoading, isFetching } = useQuery({
    queryKey: ['customOrders', 'page', page, pageSize, filterStatus, debouncedSearch],
    queryFn: () => customOrdersApi.getAllCustomOrders({
      page,
      size: pageSize,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      keyword: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const { data: stats } = useQuery({
    queryKey: ['customOrders', 'stats'],
    queryFn: () => customOrdersApi.getStats(),
  });

  const requests = requestsPage?.content ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      customOrdersApi.updateCustomOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customOrders'] });
      toast.success('Statut mis à jour');
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de la mise à jour du statut'),
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

  const getQuoteStatusStyle = (status: QuoteData['status']) => {
    const styles: Record<QuoteData['status'], string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status];
  };

  const getQuoteStatusLabel = (status: QuoteData['status']) => {
    const labels: Record<QuoteData['status'], string> = {
      draft: 'Brouillon',
      sent: 'Envoyé',
      accepted: 'Accepté',
      rejected: 'Refusé',
    };
    return labels[status];
  };

  const openRequestDetail = async (requestId: string) => {
    setIsDetailOpen(true);
    setIsLoadingDetail(true);
    try {
      const full = await customOrdersApi.getCustomOrderById(requestId);
      setSelectedRequest(full);
    } catch (err) {
      toastError(err, 'Impossible de charger la demande');
      setIsDetailOpen(false);
      setSelectedRequest(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleViewRequest = (request: CustomOrderListItemDTO) => {
    openRequestDetail(request.id);
  };

  useEffect(() => {
    if (!idParam) return;
    openRequestDetail(idParam).finally(() => {
      setSearchParams({}, { replace: true });
    });
  }, [idParam, setSearchParams]);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: requestId, status: newStatus });
    if (selectedRequest?.id === requestId) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveNotes = (requestId: string) => {
    toast.success('Notes enregistrées');
  };

  const handleCreateQuote = async (request: CustomOrderListItemDTO) => {
    setIsLoadingDetail(true);
    try {
      const full = await customOrdersApi.getCustomOrderById(request.id);
      setSelectedRequest(full);
      setIsQuoteOpen(true);
      setIsDetailOpen(false);
    } catch (err) {
      toastError(err, 'Impossible de charger la demande');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleQuoteSent = (requestId: string, quote: QuoteData) => {
    setQuotes(prev => ({ ...prev, [requestId]: quote }));
    // Update request status to contacted
    handleStatusChange(requestId, 'contacted');
  };

  const handleQuoteStatusChange = (requestId: string, newStatus: QuoteData['status']) => {
    setQuotes(prev => ({
      ...prev,
      [requestId]: { ...prev[requestId], status: newStatus }
    }));
    
    if (newStatus === 'accepted') {
      handleStatusChange(requestId, 'completed');
      toast.success('Devis accepté - Demande marquée comme terminée');
    } else if (newStatus === 'rejected') {
      toast.info('Devis refusé');
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading && !requestsPage) {
    return (
      <AdminLayout title="Demandes de Personnalisation" breadcrumbs={[{ label: 'Personnalisations' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Demandes de Personnalisation" breadcrumbs={[{ label: 'Personnalisations' }]}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border">
          <Badge className={cn('mb-2 text-[10px]', getStatusStyle('pending'))}>En attente</Badge>
          <p className="font-display text-xl sm:text-2xl">{stats?.pending ?? 0}</p>
        </div>
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border">
          <Badge className={cn('mb-2 text-[10px]', getStatusStyle('contacted'))}>Contacté</Badge>
          <p className="font-display text-xl sm:text-2xl">{stats?.contacted ?? 0}</p>
        </div>
        <div className="bg-card rounded-lg p-3 sm:p-4 border border-border col-span-2 sm:col-span-1">
          <Badge className={cn('mb-2 text-[10px]', getStatusStyle('completed'))}>Terminée</Badge>
          <p className="font-display text-xl sm:text-2xl">{stats?.completed ?? 0}</p>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="font-medium text-foreground">{requestsPage?.totalElements ?? 0}</span>
        demande{(requestsPage?.totalElements ?? 0) > 1 ? 's' : ''}
        {filterStatus !== 'all' && (
          <>· filtre <Badge className={cn('text-[10px] px-1.5 py-0', getStatusStyle(filterStatus))}>{getStatusLabel(filterStatus)}</Badge></>
        )}
        {debouncedSearch && <>· &quot;{debouncedSearch}&quot;</>}
        {isFetching && <span className="text-[10px]">(mise à jour…)</span>}
      </p>

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
        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
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
        {requests.map((request) => {
          const quote = quotes[request.id];
          return (
            <div
              key={request.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video">
                {request.imageUrl ? (
                  <img
                    src={getImageUrl(request.imageUrl)}
                    alt="Modèle"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Badge className={cn('absolute top-2 right-2', getStatusStyle(request.status))}>
                  {getStatusLabel(request.status)}
                </Badge>
                {quote && (
                  <Badge className={cn('absolute top-2 left-2', getQuoteStatusStyle(quote.status))}>
                    Devis: {getQuoteStatusLabel(quote.status)}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body font-medium">{request.customer?.fullName}</p>
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

                {quote && (
                  <div className="bg-primary/10 rounded-lg p-2">
                    <p className="font-display text-lg">{formatPrice(quote.totalPrice)}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      Valide jusqu'au {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}

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
                  {!quote ? (
                    <Button
                      size="sm"
                      className="flex-1 bg-primary text-primary-foreground"
                      onClick={() => handleCreateQuote(request)}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Devis
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`tel:${request.customer?.phone}`}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {requests.length === 0 && (
        <div className="bg-card rounded-lg p-8 text-center border border-border">
          <p className="font-body text-muted-foreground">Aucune demande trouvée</p>
        </div>
      )}

      {requestsPage && requestsPage.totalElements > 0 && (
        <AdminPagination
          page={page}
          totalPages={requestsPage.totalPages}
          totalElements={requestsPage.totalElements}
          size={pageSize}
          onPageChange={setPage}
          onSizeChange={handlePageSizeChange}
        />
      )}

      {/* Request Detail Modal - Responsive Design */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-2 border-b">
            <DialogTitle className="font-display text-sm sm:text-base truncate">
              Demande {selectedRequest?.id}
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="py-12 text-center text-muted-foreground">Chargement de la demande…</div>
          ) : selectedRequest ? (
            <div className="flex-1 overflow-y-auto">
              {/* Vertical Layout - Image on top, content below for all devices */}
              <div className="flex flex-col gap-3 p-3">
                
                {/* Image - Always on top */}
                <div className="order-1">
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-[3/2] w-full max-w-full">
                      {selectedRequest.imageUrl ? (
                        <img
                          src={getImageUrl(selectedRequest.imageUrl)}
                          alt="Modèle"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>
                    {selectedRequest.imageUrl && (
                      <a
                        href={getImageUrl(selectedRequest.imageUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-1 right-1 p-1 sm:p-1.5 bg-black/70 text-white rounded hover:bg-black/80 transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </a>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className={cn('text-[10px] px-1 py-0.5', getStatusStyle(selectedRequest.status))}>
                      {getStatusLabel(selectedRequest.status)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1 py-0.5">{getTypeLabel(selectedRequest.type)}</Badge>
                    <Badge variant="secondary" className="capitalize text-[10px] px-1 py-0.5">{selectedRequest.style}</Badge>
                  </div>
                </div>

                {/* Content - Always below image */}
                <div className="order-2 space-y-3">
                  
                  {/* Quote Info */}
                  {quotes[selectedRequest.id] && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-xs sm:text-sm flex items-center gap-1 truncate">
                          <FileText className="w-3 h-3" />
                          Devis {quotes[selectedRequest.id].id}
                        </h3>
                        <Badge className={cn('text-[10px] px-1 py-0.5', getQuoteStatusStyle(quotes[selectedRequest.id].status))}>
                          {getQuoteStatusLabel(quotes[selectedRequest.id].status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <p className="text-muted-foreground">Poids</p>
                          <p className="font-medium">{quotes[selectedRequest.id].weight}g</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-display text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 truncate">
                            {formatPrice(quotes[selectedRequest.id].totalPrice)}
                          </p>
                        </div>
                      </div>

                      {quotes[selectedRequest.id].status === 'sent' && (
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleQuoteStatusChange(selectedRequest.id, 'accepted')}
                            className="text-[10px] px-1 py-0.5 h-6 flex-1"
                          >
                            <Check className="w-2 h-2 mr-0.5" />
                            Oui
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleQuoteStatusChange(selectedRequest.id, 'rejected')}
                            className="text-[10px] px-1 py-0.5 h-6 flex-1"
                          >
                            <X className="w-2 h-2 mr-0.5" />
                            Non
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 border">
                    <h3 className="font-display text-xs sm:text-sm mb-1">Client</h3>
                    <div className="space-y-1 text-[10px] sm:text-xs">
                      <p className="font-medium truncate">{selectedRequest.customer?.fullName}</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${selectedRequest.customer?.phone}`} className="text-primary hover:underline truncate">
                          {selectedRequest.customer?.phone}
                        </a>
                      </div>
                      {selectedRequest.customer?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                          <a href={`mailto:${selectedRequest.customer.email}`} className="text-primary hover:underline truncate">
                            {selectedRequest.customer.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-display text-xs sm:text-sm mb-1">Description</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed break-words">
                      {selectedRequest.description}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <h3 className="font-display text-xs sm:text-sm mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Notes
                    </h3>
                    <Textarea
                      placeholder="Ajouter des notes sur cette demande..."
                      value={adminNotes[selectedRequest.id] || ''}
                      onChange={(e) => setAdminNotes(prev => ({
                        ...prev,
                        [selectedRequest.id]: e.target.value
                      }))}
                      rows={2}
                      className="text-[10px] sm:text-xs p-2"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveNotes(selectedRequest.id)}
                      className="mt-1 text-[10px] px-2 py-0.5 h-6 w-full"
                    >
                      Enregistrer
                    </Button>
                  </div>

                  {/* Meta Info */}
                  <div className="text-[10px] text-muted-foreground border-t pt-1">
                    <p>Reçue le {formatDate(selectedRequest.createdAt)}</p>
                    <p>~{selectedRequest.weight}g</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex-shrink-0 border-t p-3">
                <div className="flex flex-col gap-2">
                  {!quotes[selectedRequest.id] && (
                    <Button
                      onClick={() => handleCreateQuote(selectedRequest)}
                      className="w-full text-xs px-2 py-1 h-7"
                    >
                      <Calculator className="w-3 h-3 mr-1" />
                      Créer devis
                    </Button>
                  )}
                  
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => handleStatusChange(selectedRequest.id, value)}
                  >
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1">
                    <Button variant="outline" asChild className="flex-1 text-[10px] px-1 py-0.5 h-7">
                      <a href={`tel:${selectedRequest.customer?.phone}`}>
                        <Phone className="w-2.5 h-2.5 mr-0.5" />
                        Tel
                      </a>
                    </Button>
                    {selectedRequest.customer?.email && (
                      <Button variant="outline" asChild className="flex-1 text-[10px] px-1 py-0.5 h-7">
                        <a href={`mailto:${selectedRequest.customer.email}`}>
                          <Mail className="w-2.5 h-2.5 mr-0.5" />
                          Mail
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Quote Dialog */}
      <QuoteDialog
        request={selectedRequest}
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        onQuoteSent={handleQuoteSent}
      />
    </AdminLayout>
  );
};

export default AdminCustomRequests;
