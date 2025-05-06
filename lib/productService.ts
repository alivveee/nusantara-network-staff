import { supabase } from "./supabase";


export async function readProductOptions() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .order("name", { ascending: true }); // Urutkan berdasarkan name (A-Z)

  if (error) {
    console.error("Error fetching products:", error);
  } else {
    const options = data.map((product) => ({
      value: product.id,
      label: product.name,
    }));

    return options; // [{ value: 1, label: "Product A" }, { value: 2, label: "Product B" }]
  }
}
