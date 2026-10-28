import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { getReviewsForProduct } from "@/lib/reviews";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  const data = await getReviewsForProduct(numericId);

  return NextResponse.json(data, { status: 200 });
}
