export interface Product {
  id: string;
  name: string;
  quantity?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  coordinate: string;
  address: string;
  created_at: string;
}

export type TaskInfo = {
  type: string;
  customer: Customer;
};

export type RouteTask = {
  task_id: string;
  task_info: TaskInfo;
  completed_at: string | null;
  task_order: number;
};

export type Route = {
  id: string;
  asignee_id: string;
  asignee_name: string;
  created_at: string;
  completed_at: string | null;
  tasks: RouteTask[];
};
