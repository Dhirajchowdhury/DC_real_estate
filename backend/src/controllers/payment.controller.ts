import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

export class PaymentController {
  // Create an invoice
  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        clientId: z.string().uuid(),
        propertyId: z.string().uuid().optional(),
        amount: z.number(),
        dueDate: z.string()
      });
      
      const data = schema.parse(req.body);
      
      // Calculate taxes (e.g., 18% GST)
      const taxAmount = data.amount * 0.18;
      const totalAmount = data.amount + taxAmount;
      
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${Date.now()}`,
          clientId: data.clientId,
          propertyId: data.propertyId,
          amount: data.amount,
          taxAmount,
          totalAmount,
          dueDate: new Date(data.dueDate),
          status: 'PENDING'
        }
      });
      
      res.status(201).json({ status: 'success', data: { invoice } });
    } catch (error) {
      next(error);
    }
  }

  // Create Razorpay Order
  static async createPaymentOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId } = req.body;
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
      
      if (!invoice) {
        return res.status(404).json({ status: 'error', message: 'Invoice not found' });
      }

      // MOCK RAZORPAY ORDER CREATION
      // In production, we would call Razorpay SDK here
      const mockOrderId = `order_${Math.random().toString(36).substring(7)}`;

      const payment = await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          razorpayOrderId: mockOrderId,
          amount: invoice.totalAmount,
          status: 'PENDING'
        }
      });

      res.status(200).json({ 
        status: 'success', 
        data: { 
          orderId: mockOrderId, 
          amount: invoice.totalAmount, 
          currency: 'INR' 
        } 
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify Webhook
  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, paymentId, signature } = req.body;
      
      // MOCK VERIFICATION
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
      
      if (!payment) return res.status(404).json({ status: 'error', message: 'Order not found' });

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: paymentId,
          status: 'COMPLETED'
        }
      });

      // Update invoice status
      await prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: 'COMPLETED' }
      });

      res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } catch (error) {
      next(error);
    }
  }
}
