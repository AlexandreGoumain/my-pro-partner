import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStores, createStore } from "@/lib/stores/stores.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const stores = await getStores(session.user.entrepriseId);
    return NextResponse.json({ stores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const store = await createStore(session.user.entrepriseId, body);

    return NextResponse.json({ store }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
