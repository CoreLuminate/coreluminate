
export function getAccessKey(formType: string): string {
  const keyMap: Record<string, string> = {
    'contact': import.meta.env.PUBLIC_WEB3FORMS_CONTACT_ACCESS_KEY,
    'service-request': import.meta.env.PUBLIC_WEB3FORMS_SERVICE_REQUEST_ACCESS_KEY,
    'solution-request': import.meta.env.PUBLIC_WEB3FORMS_SOLUTION_REQUEST_ACCESS_KEY,
  };

  const key = keyMap[formType];

  if (!key) {
    console.error(`Web3Forms key missing for form type: ${formType}`);
    throw new Error(`Web3Forms access key not configured for form type: ${formType}`);
  }

  return key;
}

export async function submitFormToWeb3Forms(formData: FormData, formKey: string): Promise<Response> {
  
  const accessKey = getAccessKey(formKey);
  formData.append('access_key', accessKey);

  if (!accessKey) {
    return new Response(JSON.stringify({ message: 'Web3Forms access key is missing' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const json = JSON.stringify(Object.fromEntries(formData));
    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: json,
    });

    const web3FormsData = await web3FormsResponse.json();

    if (!web3FormsResponse.ok) {
      return new Response(JSON.stringify({ message: 'Error submitting form', error: web3FormsData }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } 

    return new Response(JSON.stringify({ message: 'Form submitted successfully', data: web3FormsData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    throw error;
  }
}