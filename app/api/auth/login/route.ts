import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'codeisall';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ACCESS_PASSWORD) {
      // 密码正确，设置认证 cookie
      const cookieStore = await cookies();
      cookieStore.set('auth-token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '密码错误，请重试' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '请求失败' },
      { status: 500 }
    );
  }
}
