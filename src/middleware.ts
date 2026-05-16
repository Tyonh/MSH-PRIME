import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Só executamos a lógica do Supabase em rotas de administração
  const isAdminRoute =
    request.nextUrl.pathname === "/admin" ||
    request.nextUrl.pathname.startsWith("/admin/");

  if (isAdminRoute) {
    // Se as variáveis de ambiente não estiverem configuradas, apenas seguimos para não travar o dev
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return response;
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Se estiver tentando acessar o painel admin sem estar logado (exceto login e registro)
    if (!user && 
        request.nextUrl.pathname !== '/admin/login' && 
        request.nextUrl.pathname !== '/admin/register'
    ) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Se estiver logado e tentar acessar a página de login
    if (user && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/products', request.url))
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
