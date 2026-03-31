// libs/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==================== TYPES & INTERFACES ====================

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'vendor';
  avatar?: string;
  isActive?: boolean;
  vendorInfo?: {
    businessName?: string;
    businessAddress?: string;
    phone?: string;
    description?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'vendor';
  vendorInfo?: {
    businessName: string;
    businessAddress?: string;
    phone?: string;
    description?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Menu {
  _id: string;
  id?: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  category?: string;
  image?: string;
  ingredients?: string[];
  isAvailable?: boolean;
  vendorId?: string;
  vendor?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  id?: string;
  title: string;
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  id?: string;
  orderNumber: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  items: Array<{
    menu: string;
    title: string;
    price: number;
    quantity: number;
    subtotal: number;
    _id?: string;
  }>;
  total: number;
  totalAmount?: number;
  status: string;
  specialInstructions?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  menuId: string;
  quantity: number;
  price: number;
  notes?: string;
  menu?: Menu;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  order?: T;
  orders?: T[];
  menus?: T[];
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';


}

export interface CartItem {
  _id?: string;
  menu: string | Menu;
  image: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  user: string | User;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  price: number;
  supplier?: string;
  barcode?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface EventType {
  _id: string;
  name: string;
  basePrice: number;
  image?: string;
}

export interface PartyHall {
  _id: string;
  name: string;
  capacity: number;
  pricePerPlate: number;
  isAvailable: boolean;
  image?: string;
}

export interface ExtraService {
  _id: string;
  name: string;
  price: number;
  unit?: 'fixed' | 'per_guest' | 'per_hour';
  image?: string;
}

export interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  videoUrl?: string;
  featured: boolean;
  type: 'article' | 'video' | 'photo';
  mediaUrl?: string;
  date?: string;
  createdAt?: string;
  views: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt?: string;
}

export interface PartyHall {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  image?: string;
}

export interface ExtraService {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}



export interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category: 'Food' | 'Events' | 'Interior' | 'Celebrations' | 'Other';
  description?: string;
  featured: boolean;
  createdAt?: string;
}

// ==================== JWT HELPER ====================

export const jwtHelper = {
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getTokenPayload: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },

  getUserIdFromToken: (token: string): string | null => {
    const payload = jwtHelper.getTokenPayload(token);
    return payload?.userId || payload?.id || payload?._id || null;
  },

  getTokenExpiration: (token: string): number | null => {
    const payload = jwtHelper.getTokenPayload(token);
    return payload?.exp || null;
  },

  getUserRoleFromToken: (token: string): string | null => {
    const payload = jwtHelper.getTokenPayload(token);
    return payload?.role || null;
  }
};

// ==================== AUTH TOKEN MANAGEMENT ====================

export const authToken = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      let t = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!t) return null;
      t = t.trim();
      // strip common prefixes like 'auth_token ' or 'Bearer '
      if (t.toLowerCase().startsWith('auth_token ')) {
        t = t.slice('auth_token '.length);
      }
      if (t.startsWith('Bearer ')) {
        t = t.slice('Bearer '.length);
      }
      return t;
    }
    return null;
  },

  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  isValid: (): boolean => {
    const token = authToken.get();
    if (!token) return false;
    return !jwtHelper.isTokenExpired(token);
  },

  getUserId: (): string | null => {
    const token = authToken.get();
    if (!token) return null;
    return jwtHelper.getUserIdFromToken(token);
  },

  getUserRole: (): string | null => {
    const token = authToken.get();
    if (!token) return null;
    return jwtHelper.getUserRoleFromToken(token);
  },

  // Store user data in localStorage for quick access
  setUserData: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  },

  getUserData: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }
};

// ==================== API CLIENT ====================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return authToken.get();
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let token = this.getAuthToken();

    // Check if token is expired before making request
    if (token && jwtHelper.isTokenExpired(token)) {
      console.warn('Token has expired');
      authToken.remove();
      token = null;
    }

    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle unauthorized or forbidden responses
      if (response.status === 401 || response.status === 403) {
        authToken.remove();
        throw new Error('Session expired');
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        if (data && typeof data === 'object') {
          errorMessage = data.message || data.error || errorMessage;
        } else if (typeof data === 'string' && data.length > 0) {
          errorMessage = data;
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private buildQueryString(params?: PaginationParams & Record<string, any>): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // ==================== AUTH APIs ====================

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      authToken.set(response.token);
      authToken.setUserData(response.user);
    }

    return response;
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (response.success && response.token) {
      authToken.set(response.token);
      authToken.setUserData(response.user);
    }

    return response;
  }

  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    const response = await this.request<{ success: boolean; user: User }>('/auth/profile');

    if (response.success) {
      authToken.setUserData(response.user);
    }

    return response;
  }

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user: User }> {
    const response = await this.request<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (response.success) {
      authToken.setUserData(response.user);
    }

    return response;
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } finally {
      // Always remove token regardless of server response
      authToken.remove();
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // ==================== CART APIs ====================
  async getCart(): Promise<CartResponse> {
    return this.request<CartResponse>('/cart');
  }

  async addToCart(foodId: string, quantity: number = 1): Promise<CartResponse> {
    return this.request<CartResponse>('/cart', {
      method: 'POST',
      body: JSON.stringify({ foodId, quantity })
    });
  }

  async updateCartItem(foodId: string, action: 'increase' | 'decrease'): Promise<CartResponse> {
    return this.request<CartResponse>(`/cart/${foodId}`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  }

  async removeFromCart(foodId: string): Promise<CartResponse> {
    return this.request<CartResponse>(`/cart/${foodId}`, {
      method: 'DELETE'
    });
  }

  async clearCart(): Promise<CartResponse> {
    return this.request<CartResponse>('/cart', {
      method: 'DELETE'
    });
  }

  // Helper method to get cart item count
  async getCartItemCount(): Promise<number> {
    try {
      const response = await this.getCart();
      if (response.success) {
        return response.cart.items.reduce((total, item) => total + item.quantity, 0);
      }
      return 0;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  // Helper method to calculate cart total
  calculateCartTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.subtotal, 0);
  }

  // Convert cart to order items format
  convertCartToOrderItems(cart: Cart): Array<{
    menu: string;
    title: string;
    price: number;
    quantity: number;
    subtotal: number;
  }> {
    return cart.items.map(item => ({
      menu: typeof item.menu === 'string' ? item.menu : item.menu._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));
  }

  // ==================== MENU APIs ====================

  async getMenus(params?: PaginationParams & { category?: string; vendorId?: string; isAvailable?: boolean }) {
    const queryString = this.buildQueryString(params);
    return this.request<ApiResponse<Menu[]>>(`/foods${queryString}`);
  }

  async getMenuById(id: string) {
    return this.request<ApiResponse<Menu>>(`/foods/${id}`);
  }

  async createMenu(menuData: FormData | Omit<Menu, '_id' | 'id' | 'createdAt' | 'updatedAt'>) {
    if (menuData instanceof FormData) {
      const url = `${this.baseUrl}/foods`;
      const token = this.getAuthToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'POST',
        body: menuData,
        headers
      });

      if (res.status === 401) {
        authToken.remove();
        throw new Error('Authentication failed. Please login again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create menu');
      return data;
    }

    return this.request<ApiResponse<Menu>>('/foods', {
      method: 'POST',
      body: JSON.stringify(menuData)
    });
  }

  async updateMenu(id: string, menuData: FormData | Partial<Menu>) {
    if (menuData instanceof FormData) {
      const url = `${this.baseUrl}/foods/${id}`;
      const token = this.getAuthToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'PUT',
        body: menuData,
        headers
      });

      if (res.status === 401) {
        authToken.remove();
        throw new Error('Authentication failed. Please login again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update menu');
      return data;
    }

    return this.request<ApiResponse<Menu>>(`/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData)
    });
  }

  async deleteMenu(id: string) {
    return this.request<ApiResponse>(`/foods/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleMenuAvailability(id: string) {
    return this.request<ApiResponse<Menu>>(`/foods/${id}/availability`, {
      method: 'PATCH',
    });
  }



  // ==================== CATEGORY APIs ====================


  async createCategory(categoryData: FormData | {
    title: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }) {
    if (categoryData instanceof FormData) {
      const url = `${this.baseUrl}/categories`;
      const token = this.getAuthToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'POST',
        body: categoryData,
        headers
      });

      if (res.status === 401) {
        authToken.remove();
        throw new Error('Authentication failed. Please login again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create category');
      return data;
    }

    return this.request<ApiResponse<Category>>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id: string, categoryData: FormData | {
    title?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }) {
    if (categoryData instanceof FormData) {
      const url = `${this.baseUrl}/categories/${id}`;
      const token = this.getAuthToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'PUT',
        body: categoryData,
        headers
      });

      if (res.status === 401) {
        authToken.remove();
        throw new Error('Authentication failed. Please login again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update category');
      return data;
    }

    return this.request<ApiResponse<Category>>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id: string) {
    return this.request<ApiResponse>(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  async getCategoryById(id: string) {
    return this.request<ApiResponse<Category>>(`/categories/${id}`);
  }

  // Addresses
  async getAddresses() {
    return this.request<any>('/addresses');
  }

  async getAddressById(id: string) {
    return this.request<any>(`/addresses/${id}`);
  }

  async createAddress(addressData: any) {
    return this.request<any>('/addresses', { method: 'POST', body: JSON.stringify(addressData) });
  }

  async updateAddress(id: string, addressData: any) {
    return this.request<any>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(addressData) });
  }

  async deleteAddress(id: string) {
    return this.request<any>(`/addresses/${id}`, { method: 'DELETE' });
  }

  // ==================== EXPENSE APIs ====================

  async getExpenses(params?: PaginationParams) {
    const qs = this.buildQueryString(params);
    return this.request<any>(`/expenses${qs}`);
  }

  async getExpenseById(id: string) {
    return this.request<any>(`/expenses/${id}`);
  }

  async createExpense(data: { name: string; quantity: number; rate: number; cash?: number; upi?: number; credit?: number; person?: string }) {
    return this.request<any>('/expenses', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateExpense(id: string, data: any) {
    return this.request<any>(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteExpense(id: string) {
    return this.request<any>(`/expenses/${id}`, { method: 'DELETE' });
  }

  // Sales endpoints
  // async getSalesOrders(params?: PaginationParams) {
  //   const qs = this.buildQueryString(params);
  //   return this.request<any>(`/sales/orders${qs}`);
  // }

  async settleOrder(id: string, body?: any) {
    return this.request<any>(`/sales/settle/${id}`, { method: 'POST', body: JSON.stringify(body || {}) });
  }

  async getSalesReport(params?: PaginationParams) {
    const qs = this.buildQueryString(params);
    return this.request<any>(`/sales/report${qs}`);
  }

  async getCategories(params?: PaginationParams & { isActive?: boolean }) {
    const queryString = this.buildQueryString(params);
    return this.request<ApiResponse<Category[]>>(`/categories${queryString}`);
  }

  async toggleCategoryStatus(id: string) {
    return this.request<ApiResponse<Category>>(`/categories/${id}/status`, {
      method: 'PATCH',
    });
  }

  // ==================== MANAGEMENT APIs ====================

  async getManagements(params?: PaginationParams) {
    const qs = this.buildQueryString(params);
    return this.request<any>(`/management${qs}`);
  }

  async generateDailySummary() {
    return this.request<any>('/management/daily-summary', { method: 'POST' });
  }


  // ==================== ORDER APIs ====================

  // ==================== SALES-ORDERS (SalesOrder) APIs ====================

  async getSalesOrders(params?: PaginationParams) {
    const qs = this.buildQueryString(params);
    return this.request<any>(`/sales-orders${qs}`);
  }

  async getSalesOrderById(id: string) {
    return this.request<any>(`/sales-orders/${id}`);
  }

  async createSalesOrder(data: {
    // support either single-item legacy fields OR items array
    name?: string;
    price?: number;
    quantity?: number;
    items?: Array<{ menu?: string; title: string; price: number; quantity: number; subtotal: number }>;
    total?: number;
    tableNumber?: string;
    date?: string;
    timing?: string;
    settlementMethod?: string;
    upiCode?: string;
  }) {
    return this.request<any>('/sales-orders', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateSalesOrder(id: string, data: any) {
    return this.request<any>(`/sales-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteSalesOrder(id: string) {
    return this.request<any>(`/sales-orders/${id}`, { method: 'DELETE' });
  }

  async getNextSalesOrderNumber() {
    return this.request<{ success: boolean, orderNumber: string }>('/sales-orders/next-order-number');
  }


  async getOrders(params?: PaginationParams & {
    status?: string;
    userId?: string;
    vendorId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryString = this.buildQueryString(params);
    return this.request<ApiResponse<Order[]>>(`/orders${queryString}`);
  }

  async getOrderById(id: string) {
    return this.request<ApiResponse<Order>>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    };
    items: Array<{
      menu: string;
      title: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
    total: number;
    status?: string;
    specialInstructions?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  }) {
    return this.request<ApiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // ✅ UPDATE ORDER METHOD - Full order update
  async updateOrder(id: string, orderData: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    };
    items: Array<{
      menu: string;
      title: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
    total: number;
    status?: string;
    specialInstructions?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  }) {
    return this.request<ApiResponse<Order>>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    });
  }

  async getOrder(id: string) {
    return this.request<ApiResponse<Order>>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<ApiResponse<Order>>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async cancelOrder(id: string) {
    return this.request<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteOrder(id: string) {
    return this.request<ApiResponse>(`/orders/${id}`, {
      method: 'DELETE'
    });
  }

  async getNextOrderNumber() {
    return this.request<{ success: boolean, orderNumber: string }>('/orders/next-order-number');
  }

  // ==================== VENDOR APIs ====================

  async getVendorMenus(vendorId: string, params?: PaginationParams) {
    const queryString = this.buildQueryString(params);
    return this.request<ApiResponse<Menu[]>>(`/vendors/${vendorId}/menus${queryString}`);
  }

  async getVendorProfile(vendorId: string) {
    return this.request<ApiResponse<User>>(`/vendors/${vendorId}`);
  }

  async updateVendorProfile(vendorData: Partial<User>) {
    return this.request<ApiResponse<User>>('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(vendorData)
    });
  }


  // ==================== INVENTORY APIs ====================

  async getInventory(params?: PaginationParams) {
    const qs = this.buildQueryString(params);
    return this.request<ApiResponse<InventoryItem[]>>(`/inventory${qs}`);
  }

  async getInventoryItem(id: string) {
    return this.request<ApiResponse<InventoryItem>>(`/inventory/${id}`);
  }

  async getInventoryByBarcode(barcode: string) {
    return this.request<ApiResponse<InventoryItem>>(`/inventory/barcode/${barcode}`);
  }

  async createInventoryItem(data: Partial<InventoryItem>) {
    return this.request<ApiResponse<InventoryItem>>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateInventoryItem(id: string, data: Partial<InventoryItem>) {
    return this.request<ApiResponse<InventoryItem>>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteInventoryItem(id: string) {
    return this.request<ApiResponse>(`/inventory/${id}`, {
      method: 'DELETE'
    });
  }


  // ==================== ADMIN APIs ====================

  async adminGetAllUsers(params?: PaginationParams & { role?: string; isActive?: boolean }) {
    const queryString = this.buildQueryString(params);
    return this.request<ApiResponse<User[]>>(`/admin/users${queryString}`);
  }

  async adminGetUserById(userId: string) {
    return this.request<ApiResponse<User>>(`/admin/users/${userId}`);
  }

  async adminUpdateUserRole(userId: string, role: 'user' | 'admin' | 'vendor') {
    return this.request<ApiResponse<User>>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async adminToggleUserStatus(userId: string) {
    return this.request<ApiResponse<User>>(`/admin/users/${userId}/status`, {
      method: 'PUT',
    });
  }

  async adminDeleteUser(userId: string) {
    return this.request<ApiResponse>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async adminGetStats() {
    return this.request<ApiResponse<{
      totalUsers: number;
      totalVendors: number;
      totalOrders: number;
      totalRevenue: number;
      recentOrders: Order[];
    }>>('/admin/stats');
  }

  // ==================== UTILITY METHODS ====================

  isAuthenticated(): boolean {
    return authToken.isValid();
  }

  getCurrentUserId(): string | null {
    return authToken.getUserId();
  }

  getCurrentUserRole(): string | null {
    return authToken.getUserRole();
  }

  getStoredUserData(): User | null {
    return authToken.getUserData();
  }

  // Check if current user has specific role
  hasRole(role: User['role']): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole === role;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if current user is vendor
  isVendor(): boolean {
    return this.hasRole('vendor');
  }

  // Check if current user is regular user
  isUser(): boolean {
    return this.hasRole('user');
  }

  // Token refresh (if your API supports it)
  async refreshToken(): Promise<{ success: boolean; token: string; user: User }> {
    const response = await this.request<{ success: boolean; token: string; user: User }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.success && response.token) {
      authToken.set(response.token);
      authToken.setUserData(response.user);
    }

    return response;
  }

  // Upload file (generic file upload)
  async uploadFile(file: File, folder?: string): Promise<{ success: boolean; url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const url = `${this.baseUrl}/upload`;
    const token = this.getAuthToken();
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers
    });

    if (res.status === 401) {
      authToken.remove();
      throw new Error('Authentication failed. Please login again.');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload file');
    return data;
  }

  // ==================== ADMIN SPECIFIC APIs ====================

  async getAllCarts(): Promise<Cart[]> {
    return this.request<Cart[]>('/cart/all');
  }

  async getEventTypes(): Promise<EventType[]> {
    return this.request<EventType[]>('/events/types');
  }

  async createEventType(data: FormData | { name: string; basePrice: number }) {
    if (data instanceof FormData) {
      const url = `${this.baseUrl}/events/types`;
      const token = this.getAuthToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'POST',
        body: data,
        headers
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Failed to create event type');
      return resData;
    }

    return this.request<EventType>('/events/types', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteEventType(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/events/types/${id}`, {
      method: 'DELETE'
    });
  }

  async getPartyHalls(): Promise<PartyHall[]> {
    return this.request<PartyHall[]>('/events/halls');
  }

  async createPartyHall(data: Omit<PartyHall, '_id'>): Promise<PartyHall> {
    return this.request<PartyHall>('/events/halls', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deletePartyHall(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/events/halls/${id}`, {
      method: 'DELETE'
    });
  }

  async getExtraServices(): Promise<ExtraService[]> {
    return this.request<ExtraService[]>('/events/services');
  }

  async createExtraService(data: Omit<ExtraService, '_id'>): Promise<ExtraService> {
    return this.request<ExtraService>('/events/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteExtraService(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/events/services/${id}`, {
      method: 'DELETE'
    });
  }

  // 🥂 EVENT BOOKINGS
  async getEventBookings(): Promise<any[]> {
    return this.request<any[]>('/events');
  }

  async createEventBooking(data: any): Promise<any> {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteEventBooking(id: string): Promise<any> {
    return this.request<any>(`/events/${id}`, {
      method: 'DELETE'
    });
  }

  async updateEventBookingStatus(id: string, status: string): Promise<any> {
    return this.request<any>(`/events/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // 📝 BLOG APIs
  async getBlogs(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/blogs');
  }

  async getBlogById(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/blogs/${id}`);
  }

  async createBlog(blogData: FormData): Promise<BlogPost> {
    return this.request<BlogPost>('/blogs', {
      method: 'POST',
      body: blogData
    });
  }

  async updateBlog(id: string, blogData: FormData): Promise<BlogPost> {
    return this.request<BlogPost>(`/blogs/${id}`, {
      method: 'PUT',
      body: blogData
    });
  }

  async deleteBlog(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/blogs/${id}`, {
      method: 'DELETE'
    });
  }

  // 📧 CONTACT APIs
  async getContacts(): Promise<ContactMessage[]> {
    return this.request<ContactMessage[]>('/contacts');
  }

  async sendContactMessage(data: Omit<ContactMessage, '_id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    return this.request<ContactMessage>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateContactStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    return this.request<ContactMessage>(`/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/contacts/${id}`, {
      method: 'DELETE'
    });
  }

  // 🖼️ GALLERY APIs
  async getGallery(): Promise<GalleryItem[]> {
    return this.request<GalleryItem[]>('/gallery');
  }

  async createGallery(data: FormData): Promise<GalleryItem> {
    return this.request<GalleryItem>('/gallery', {
      method: 'POST',
      body: data
    });
  }

  async deleteGallery(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/gallery/${id}`, {
      method: 'DELETE'
    });
  }
}

// ==================== EXPORT INSTANCE ====================

export const apiClient = new ApiClient(API_BASE_URL);

// ==================== HOOKS & UTILITIES ====================

// For React components (you can create a separate hooks file if needed)
export const useApi = () => {
  return {
    // Auth status
    isAuthenticated: () => apiClient.isAuthenticated(),
    getUserRole: () => apiClient.getCurrentUserRole(),
    getUserData: () => apiClient.getStoredUserData(),

    // Quick checks
    isAdmin: () => apiClient.isAdmin(),
    isVendor: () => apiClient.isVendor(),
    isUser: () => apiClient.isUser(),

    // Token info
    getTokenInfo: () => {
      const token = authToken.get();
      if (!token) return null;

      return {
        payload: jwtHelper.getTokenPayload(token),
        isExpired: jwtHelper.isTokenExpired(token),
        expiresAt: jwtHelper.getTokenExpiration(token) ?
          new Date(jwtHelper.getTokenExpiration(token)! * 1000) : null,
        userId: jwtHelper.getUserIdFromToken(token),
        role: jwtHelper.getUserRoleFromToken(token)
      };
    }
  };
};

// Error handler utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

// Response handler utility
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.data!;
};