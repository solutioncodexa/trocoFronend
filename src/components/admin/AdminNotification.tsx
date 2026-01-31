import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, Palette } from 'lucide-react';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs text-primary hover:underline"
            >
              Tout marquer lu
            </button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              Aucune notification
            </p>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-stretch gap-1 py-3 cursor-pointer focus:bg-muted"
                onSelect={(e) => {
                  e.preventDefault();
                  handleNotificationClick(n);
                }}
              >
                <div className="flex items-start gap-3 w-full text-left">
                  <div className="shrink-0 mt-0.5">
                    {n.type === 'ORDER' ? (
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    ) : (
                      <Palette className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-medium text-sm', !n.read && 'font-semibold')}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {(notifications.length > 0 && (notifications.some((n) => !n.read) || notifications.length > 10)) && (
          <div className="border-t p-2">
            <Link
              to={unreadCount > 0 ? '/admin/commandes' : '/admin/dashboard'}
              className="block text-center text-sm text-primary hover:underline py-1"
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
