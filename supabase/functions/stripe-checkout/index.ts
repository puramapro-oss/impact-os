import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-04-10",
  httpClient: Stripe.createFetchHttpClient(),
});

const COMMISSION_RATE = 0.11;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency = "eur", mandate_id, success_url, cancel_url } =
      await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Montant invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const commissionAmount = Math.round(amount * COMMISSION_RATE);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Commission MANA",
              description: `Commission de ${(COMMISSION_RATE * 100).toFixed(0)}% — Mandat #${mandate_id ?? "N/A"}`,
            },
            unit_amount: commissionAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        mandate_id: mandate_id ?? "",
        original_amount: String(amount),
        commission_rate: String(COMMISSION_RATE),
      },
      success_url: success_url ?? `${req.headers.get("origin")}/dashboard?payment=success`,
      cancel_url: cancel_url ?? `${req.headers.get("origin")}/dashboard?payment=cancelled`,
    });

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création du paiement";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
