import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { notificationsApi } from '@/services/api/notifications';
import type { NotificationDTO } from '@/types/api';

const AdminNotification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (n: NotificationDTO) => {
    markAsReadMutation.mutate(n.id);
    const refId = n.referenceId?.toString();
    if (!refId) return;
    if (n.type === 'ORDER') {
      navigate(`/admin/commandes?order=${refId}`);
    } else if (n.type === 'CUSTOM_ORDER') {
      navigate(`/admin/personnalisations?id=${refId}`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIcon = (type: string) => {
    if (type === 'ORDER') {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
          <ShoppingCart className="w-4 h-4 text-primary" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 shrink-0">
        <Palette className="w-4 h-4 text-accent" />
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm animate-scale-in">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] p-0 border-border/60 shadow-elegant overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsReadMutation.mutate()}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Check className="w-3 h-3" />
              Tout marquer lu
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto scrollbar-app">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Aucune notification
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Vous serez notifié des nouvelles commandes ici
              </p>
            </div>
          ) : (
            notifications.slice(0, 12).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 cursor-pointer rounded-none border-b border-border/30 last:border-0 transition-colors focus:bg-primary/5',
                  !n.read && 'bg-primary/[0.03]'
                )}
                onSelect={(e) => {
                  e.preventDefault();
                  handleNotificationClick(n);
                }}
              >
                {getIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm leading-snug',
                    !n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                  )}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {n.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_4px_hsl(43,70%,47%,0.4)]" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border/50 bg-muted/30">
            <Link
              to={unreadCount > 0 ? '/admin/commandes' : '/admin/dashboard'}
              className="flex items-center justify-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium py-2.5 transition-colors"
            >
              Voir toutes les commandes
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotification;
