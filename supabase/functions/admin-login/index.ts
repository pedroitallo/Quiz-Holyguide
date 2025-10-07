import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.56.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  console.log("[admin-login] Request received:", req.method, req.url);
  
  if (req.method === "OPTIONS") {
    console.log("[admin-login] Handling OPTIONS request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[admin-login] Parsing request body");
    const body = await req.json();
    console.log("[admin-login] Body parsed, email:", body.email);
    
    const { email, password } = body;

    if (!email || !password) {
      console.log("[admin-login] Missing email or password");
      return new Response(
        JSON.stringify({ success: false, error: "Email and password are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[admin-login] Creating Supabase client");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("[admin-login] Missing Supabase credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("[admin-login] Supabase client created");

    console.log("[admin-login] Querying admin_users table");
    const { data: adminUser, error: queryError } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, is_active")
      .eq("email", email)
      .maybeSingle();

    if (queryError) {
      console.error("[admin-login] Query error:", queryError);
      return new Response(
        JSON.stringify({ success: false, error: "Database query failed: " + queryError.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!adminUser) {
      console.log("[admin-login] Admin user not found");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[admin-login] Admin user found, checking active status");
    if (!adminUser.is_active) {
      console.log("[admin-login] Account is inactive");
      return new Response(
        JSON.stringify({ success: false, error: "Account is inactive" }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[admin-login] Verifying password");
    const { data: verifyResult, error: verifyError } = await supabase.rpc(
      "verify_admin_password",
      {
        user_email: email,
        user_password: password,
      }
    );

    if (verifyError) {
      console.error("[admin-login] Password verification error:", verifyError);
      return new Response(
        JSON.stringify({ success: false, error: "Password verification failed: " + verifyError.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[admin-login] Password verification result:", verifyResult);
    if (!verifyResult) {
      console.log("[admin-login] Invalid password");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[admin-login] Updating last_login");
    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", adminUser.id);

    console.log("[admin-login] Login successful");
    const response = {
      success: true,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
      },
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[admin-login] Unexpected error:", error);
    const errorResponse = { 
      success: false, 
      error: error?.message || "An unexpected error occurred",
      stack: error?.stack || "No stack trace"
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});