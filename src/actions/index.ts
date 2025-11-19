import { defineAction } from 'astro:actions';
import { getSecret } from 'astro:env/server';
import { z } from 'astro:schema';

const secretKey = getSecret('CF_TURNSTILE_SECRET_KEY');

export const server = {
  verifyTurnstileToken: defineAction({
    input: z.object({
      token: z.string(),
    }),
    handler: async (input) => {
      try {

        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: secretKey,
            response: input.token,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          return { success: true };
        } else {
          throw new Error('Turnstile verification failed');
        }
      } catch (error) {
        console.error('Error verifying Turnstile token:', error);
        throw new Error('Internal Error: Failed to verify Turnstile token');
      }
    },
  }), 
};