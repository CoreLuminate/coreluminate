
export function getAccessKey(formType: string): string {
  const keyMap: Record<string, string> = {
    'contact': '9fb2a2c2-9fba-43a8-bfe5-7d189bb01b39',
    'service-request': '6c5a7d66-8d81-445f-a6c9-dfa61350da93',
    'solution-request': '48af0525-c7d2-4227-a882-68088cb18708',
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