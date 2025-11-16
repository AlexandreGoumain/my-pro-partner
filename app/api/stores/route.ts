import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { getStores, createStore } from "@/lib/stores/stores.service";

export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const stores = await getStores(entrepriseId);
    return NextResponse.json({ stores });
  } catch (error: any) {
    return handleTenantError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const store = await createStore(entrepriseId, body);

    return NextResponse.json({ store }, { status: 201 });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
