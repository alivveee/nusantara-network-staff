import { endOfToday, startOfToday } from "date-fns";
import { Product, Route, RouteTask } from "@/types";
import { supabase } from "./supabase";

type RouteWithStatus = Omit<Route, "tasks"> & {
  running_task: RouteTask[];
  completed_task: RouteTask[];
};

export const readTodayRoute = async (
  asignee_id: string
): Promise<RouteWithStatus | null> => {
  const start = startOfToday().toISOString();
  const end = endOfToday().toISOString();

  const { data, error } = await supabase
    .from("routes")
    .select(
      `
      *, 
      tasks:reports(
        task_id,
        task_info:tasks(type, customer:customers(name, id, address)), 
        task_order,
        completed_at
      )
    `
    )
    .order("created_at", { ascending: false })
    .eq("asignee_id", asignee_id)
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching today's route:", error);
    return null;
  }

  const route = data?.[0];
  if (!route) return null;

  // Sort tasks berdasarkan task_order
  route.tasks = route.tasks.sort(
    (a: { task_order: number }, b: { task_order: number }) => {
      if (a.task_order == null) return 1;
      if (b.task_order == null) return -1;
      return a.task_order - b.task_order;
    }
  );

  const running_task = route.tasks.filter(
    (task: { completed_at: string | null }) => task.completed_at === null
  );

  const completed_task = route.tasks.filter(
    (task: { completed_at: string | null }) => task.completed_at !== null
  );

  // Buat objek baru tanpa `tasks`
  const { tasks, ...routeWithoutTasks } = route;

  return {
    ...routeWithoutTasks,
    running_task,
    completed_task,
  };
};

export const readProductsByTaskId = async (taskId: string) => {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "products:task_products(product_id, product:products(name), quantity)"
    )
    .eq("id", taskId)
    .single();

  if (error) {
    console.error("Error fetching products by task ID:", error);
    return null;
  }
  const formattedData = data?.products.map((item: any) => ({
    id: item.product_id,
    name: item.product.name,
    quantity: item.quantity,
  }));

  return formattedData;
};

export async function addReport(
  task_id: string,
  route_id: string,
  note: string,
  recipient: string,
  status: string,
  products: Product[],
  coords: { latitude: number; longitude: number } | null
): Promise<{ success: boolean; message?: string }> {
  const { error: reportError } = await supabase
    .from("reports")
    .update({
      note,
      recipient,
      completed_at: new Date().toISOString(),
      completed_coord: coords,
    })
    .match({ route_id, task_id });

  if (reportError) {
    return { success: false, message: reportError.message };
  }

  const { error: taskError } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", task_id);

  if (taskError) {
    return { success: false, message: taskError.message };
  }

  const reportProduct = products.map((product) => ({
    product_id: product.id, // <-- PK
    route_id, // <-- PK
    task_id, // <-- PK
    quantity: product.quantity,
  }));

  const { error: createTaskProductsError } = await supabase
    .from("report_products")
    .insert(reportProduct);

  if (createTaskProductsError) {
    return { success: false, message: createTaskProductsError.message };
  }

  return { success: true };
}
export async function addFailedReport(
  task_id: string,
  route_id: string,
  note: string,
  status: string,
  coords: { latitude: number; longitude: number } | null
): Promise<{ success: boolean; message?: string }> {
  const { error: reportError } = await supabase
    .from("reports")
    .update({
      note,
      completed_at: new Date().toISOString(),
      completed_coord: coords,
    })
    .match({ route_id, task_id });

  if (reportError) {
    return { success: false, message: reportError.message };
  }

  const { error: taskError } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", task_id);

  if (taskError) {
    return { success: false, message: taskError.message };
  }

  return { success: true };
}
