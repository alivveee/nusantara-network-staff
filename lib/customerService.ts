import { supabase } from "./supabase";

export async function readCustomerById(id: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id) // Filter berdasarkan id
    .single(); // Mengambil satu hasil saja

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  return data; // Mengembalikan satu objek customer
}

export async function readCustomerOptions() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name")
    .order("name", { ascending: true }); // Urutkan berdasarkan name (A-Z)

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  } else {
    const options = data.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }));

    return options || []; // [{ value: 1, label: "Customer A" }, { value: 2, label: "Customer B" }]
  }
}


