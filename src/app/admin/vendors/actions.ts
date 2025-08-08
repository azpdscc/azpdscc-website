
'use server';

import { z } from 'zod';
import { processVendorApplicationAction, VendorApplicationState } from './application-actions';

const boothOptions: { [key: string]: string } = {
    '10x10-own': '10x10 Booth (Own Canopy) - $250',
    '10x10-our': '10x10 Booth (Our Canopy) - $350',
    '10x20-own': '10x20 Booth (Own Canopy) - $500',
    '10x20-our': '10x20 Booth (Our Canopy) - $650',
};

const boothPrices: { [key: string]: number } = {
    '10x10-own': 250,
    '10x10-our': 350,
    '10x20-own': 500,
    '10x20-our': 650,
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  organization: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  boothType: z.enum(['10x10-own', '10x10-our', '10x20-own', '10x20-our']),
  productDescription: z.string().min(20, "Description must be at least 20 characters.").max(500),
  zelleSenderName: z.string().min(2, "Zelle sender name is required."),
  zelleDateSent: z.coerce.date({ required_error: "Please select the date you sent the payment." }),
  paymentSent: z.boolean().refine(val => val === true, {
    message: 'You must confirm payment has been sent.',
  }),
});


export async function vendorApplicationAction(
    baseUrl: string,
    prevState: VendorApplicationState,
    formData: FormData
): Promise<VendorApplicationState> {

    const boothTypeKey = formData.get('boothType') as string;

    const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        organization: formData.get('organization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        boothType: boothTypeKey,
        productDescription: formData.get('productDescription'),
        zelleSenderName: formData.get('zelleSenderName'),
        zelleDateSent: formData.get('zelleDateSent'),
        paymentSent: formData.get('paymentSent') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const dataWithPrice = {
        ...validatedFields.data,
        totalPrice: boothPrices[boothTypeKey],
        boothType: boothOptions[boothTypeKey],
    }

    return processVendorApplicationAction(baseUrl, dataWithPrice);
}
