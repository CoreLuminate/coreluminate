import { getSecret } from "astro:env/server";

export async function verifyToken(token: string): Promise<boolean> {
  const secretKey = getSecret('CF_TURNSTILE_SECRET_KEY');

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}