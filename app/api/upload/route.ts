import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getSupabaseErrorMessage } from "@/lib/supabase";

const BUCKET = "products";
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET_KEY) return jsonError("Unauthorized", 401);
  if (!supabaseAdmin) return jsonError(getSupabaseErrorMessage(), 500);

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) return jsonError("No file provided");
  if (!TYPE_TO_EXT[file.type]) return jsonError("Formato non supportato. Usa JPG, PNG, WebP o GIF.");
  if (file.size > MAX_FILE_SIZE) return jsonError("Immagine troppo pesante. Carica un file sotto gli 8 MB.");

  const ext = TYPE_TO_EXT[file.type];
  const filename = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data: bucket, error: bucketError } = await supabaseAdmin.storage.getBucket(BUCKET);
  if (bucketError || !bucket) {
    return jsonError(`Bucket Supabase Storage "${BUCKET}" non trovato. Crealo da Storage e rendilo pubblico.`, 500);
  }
  if (!bucket.public) {
    return jsonError(`Il bucket Supabase Storage "${BUCKET}" deve essere pubblico, altrimenti il sito non può mostrare le immagini.`, 500);
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) return jsonError(error.message, 500);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
  if (!data.publicUrl) return jsonError("Upload completato, ma URL pubblico non generato.", 500);

  return NextResponse.json(
    { url: data.publicUrl, path: filename },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
