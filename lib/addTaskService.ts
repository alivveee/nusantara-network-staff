import { Product } from "@/types";
import { endOfToday, format, startOfToday } from "date-fns";
import { supabase } from "./supabase";

export async function addDeliveryTask(
  customer_id: string,
  products: Product[]
) {
  const newTask = {
    type: "pengiriman",
    customer_id,
    status: "berjalan",
    date: format(new Date(), "yyyy-MM-dd"),
  };

  const { data: createTaskResult, error: createTaskError } = await supabase
    .from("tasks")
    .insert(newTask)
    .select("id")
    .single();

  if (createTaskError) {
    return { success: false, message: createTaskError.message };
  }
  // memasukkan setiap produk ke task_products
  const taskProducts = products.map((product) => ({
    task_id: createTaskResult.id,
    product_id: product.id,
    product_name: product.name,
    quantity: product.quantity,
  }));

  const { error: createTaskProductsError } = await supabase
    .from("task_products")
    .insert(taskProducts);

  if (createTaskProductsError) {
    return { success: false, message: createTaskProductsError.message };
  }

  const { data: routeResult } = await supabase
    .from("routes")
    .select("id")
    .gte("created_at", startOfToday().toISOString())
    .lt("created_at", endOfToday().toISOString())
    .single();

  if (!routeResult) {
    return { success: false, message: "Route not found" };
  }

  const { error: createTaskReportError } = await supabase
    .from("reports")
    .insert({
      route_id: routeResult.id,
      task_id: createTaskResult.id,
    });

  if (createTaskReportError) {
    return { success: false, message: createTaskReportError.message };
  }

  return { success: true };
}

export async function addCanvassingTask(
  customer: {
    name: string;
    phone: string;
    coordinate: string;
    address: string;
  },
  products: Product[]
) {
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .insert(customer)
    .select("id")
    .single();

  if (customerError) {
    return { success: false, message: customerError.message };
  }

  const newTask = {
    type: "kanvassing",
    customer_id: customerData.id,
    status: "berjalan",
    date: format(new Date(), "yyyy-MM-dd"),
  };

  const { data: createTaskResult, error: createTaskError } = await supabase
    .from("tasks")
    .insert(newTask)
    .select("id")
    .single();

  if (createTaskError) {
    return { success: false, message: createTaskError.message };
  }
  // memasukkan setiap produk ke task_products
  const taskProducts = products.map((product) => ({
    task_id: createTaskResult.id,
    product_id: product.id,
    product_name: product.name,
    quantity: product.quantity,
  }));

  const { error: createTaskProductsError } = await supabase
    .from("task_products")
    .insert(taskProducts);

  if (createTaskProductsError) {
    return { success: false, message: createTaskProductsError.message };
  }

  const { data: routeResult } = await supabase
    .from("routes")
    .select("id")
    .gte("created_at", startOfToday().toISOString())
    .lt("created_at", endOfToday().toISOString())
    .single();

  if (!routeResult) {
    return { success: false, message: "Route not found" };
  }

  const { error: createTaskReportError } = await supabase
    .from("reports")
    .insert({
      route_id: routeResult.id,
      task_id: createTaskResult.id,
    });

  if (createTaskReportError) {
    return { success: false, message: createTaskReportError.message };
  }

  return { success: true };
}
