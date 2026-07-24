export interface DailyRevenuePointDTO {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductRevenueDTO {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface RevenueStatsDTO {
  deliveredRevenue: number;
  confirmedRevenue: number;
  deliveredOrders: number;
  confirmedOrders: number;
  newOrders: number;
  cancelledOrders: number;
  totalOrders: number;
  averageBasket: number;
  cancellationRate: number;
  daily: DailyRevenuePointDTO[];
  topProducts: TopProductRevenueDTO[];
}

export interface DashboardStatsDTO {
  productCount: number;
  orderCount: number;
  newOrderCount: number;
  customOrderCount: number;
  pendingCustomOrderCount: number;
  deliveredRevenue: number;
  lowStockCount: number;
  outOfStockCount: number;
}
