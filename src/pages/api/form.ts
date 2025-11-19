export const prerender = false;
import type { APIRoute } from 'astro';

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = import.meta.env.PUBLIC_TURNSTILE_SECRET_KEY;

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

function getFormKey(formType: string): string | null {
  switch (formType) {
    case 'contact':
      return import.meta.env.WEB3FORMS_CONTACT_FORM_KEY;
    case 'service-request':
      return import.meta.env.WEB3FORMS_SERVICE_REQUEST_FORM_KEY;
    case 'solution-request':
      return import.meta.env.WEB3FORMS_SOLUTION_REQUEST_FORM_KEY;
    default:
      return null;
  }
}

async function submitFormToWeb3Forms(formData: FormData, formKey: string): Promise<Response> {
  const payload = new URLSearchParams();
  formData.forEach((value, key) => {
    payload.append(key, value.toString());
  });
  payload.append('access_key', formKey);

  try {
  return fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    throw error;
  }
}

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const turnstileToken = data['cf-turnstile-response'] as string;
  if (!turnstileToken) {
    return new Response(JSON.stringify({ message: 'Turnstile token is missing' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    return new Response(JSON.stringify({ message: 'Turnstile verification failed' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const formType = data['formType'] as string;
  const formKey = getFormKey(formType);
  if (!formKey) {
    return new Response(JSON.stringify({ message: 'Invalid form type' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const web3FormsResponse = await submitFormToWeb3Forms(formData, formKey);
    const web3FormsData = await web3FormsResponse.json();

    if (web3FormsResponse.ok) {
      return new Response(JSON.stringify({ message: 'Form submitted successfully', data: web3FormsData }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Error submitting form', error: web3FormsData }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
