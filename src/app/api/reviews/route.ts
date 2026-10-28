import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { products } from "@/data/products";
import { reviewSchema } from "@/lib/reviewSchema";

export async function POST(request: NextRequest) {
  // 1. Authentication check
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid input", issues: [{ message: "Invalid JSON format" }] },
      { status: 400 }
    );
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { product_id, rating, comment } = parsed.data;

  // 3. Product check
  const product = products.find((p) => p.id === product_id);
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // 4. Insert into reviews using user's token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: createdRow, error: insertError } = await userClient
    .from("reviews")
    .insert({
      product_id,
      rating,
      comment,
    })
    .select()
    .single();

  if (insertError) {
    // 23505 is PostgreSQL unique constraint violation
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: insertError.message || "Failed to create review" },
      { status: 400 }
    );
  }

  // 5. Revalidate product page cache
  revalidatePath(`/products/${product_id}`, "page");
  revalidatePath(`/products/${product_id}`);

  // 6. Return 201 with created row
  return NextResponse.json(createdRow, { status: 201 });
}
