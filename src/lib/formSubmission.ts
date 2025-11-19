import { actions } from 'astro:actions';
import * as web3forms from './web3forms';

export interface FormSubmissionResult {
  success: boolean;
  message: string;
}

export async function submitFormData( formData: FormData, formName: string ): Promise<FormSubmissionResult> {

  const { cf_turnstile_response, ...data } = Object.fromEntries(formData);

  if (!cf_turnstile_response) {
    return {
      success: false,
      message: 'Turnstile token is missing. Please confirm you are not a bot.',
    };
  }

  try {

    const isHuman = await actions.verifyTurnstileToken({ token: cf_turnstile_response as string });
    if (!isHuman) {
      return {
        success: false,
        message: 'Turnstile verification failed. Please confirm you are not a bot.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during token verification.',
    };
  }

  const formDataToSend = new FormData();
  for (const key in data) {
    formDataToSend.append(key, data[key] as string);
  }

  try {
    const response = await web3forms.submitFormToWeb3Forms(formDataToSend, formName);

    if(response.status !== 200) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error?.message || 'Failed to submit the form. Please try again later.',
        };
      } 

    return {
      success: true,
      message: 'Form submitted successfully.', 
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while submitting the form. Please try again later.',
    };
  }
}