// ========== CONFIGURACIÓN DE SUPABASE ==========
// Requiere cargar antes el CDN:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//
// La clave "publishable" está pensada para usarse en el navegador.
// La seguridad depende de las políticas RLS configuradas en Supabase.

const SUPABASE_URL = 'https://vlpqchllugdsbgrhbpau.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yNXXSgasNGdoHfog-qz7rQ_Tr5b54hx';

// El CDN expone la librería como window.supabase; aquí creamos el cliente
// y lo dejamos disponible globalmente como `supabaseClient`.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
