export async function verifyToken(token: string): Promise<boolean> {
  const secretKey = '0x4AAAAAACAyOqr58Q-vjuE6wW4-iE59KNs';

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