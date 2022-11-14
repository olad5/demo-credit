import { nanoid } from "nanoid";
import {
  InitializedResponse,
  InitializeRequest,
  IPaymentService,
  VerifyResponse
} from "../../../services/paymentService";

export class PaymentServiceSpy implements IPaymentService {
  serviceName: string;
  private timesInitializePaymentCalled: number;
  private currentResponseStatus: boolean;

  constructor() {
    this.serviceName = "paymentServiceSpy";
    this.timesInitializePaymentCalled = 0;
    this.currentResponseStatus = true;
  }

  async initializePayment(
    request: InitializeRequest
  ): Promise<InitializedResponse> {
    const response: InitializedResponse = {
      status: this.currentResponseStatus,
      message: this.currentResponseStatus
        ? "initialized"
        : "failed to initialize",
      data: {
        authorization_url: `https://checkout.paystack.com/${nanoid(15)}`,
        access_code: nanoid(15),
        reference: nanoid(10)
      }
    };

    this.timesInitializePaymentCalled++;
    return response;
  }

  changeResponseStatus(status: boolean): void {
    this.currentResponseStatus = status;
  }

  getTimesInitializePaymentCalled(): number {
    return this.timesInitializePaymentCalled;
  }

  async verifyPayment(reference: string): Promise<VerifyResponse> {
    const response: VerifyResponse = {
      status: true,
      message: this.currentResponseStatus ? "verified" : "failed to verify",
      data: {
        amount: 10,
        status: "success",
        reference
      }
    };

    return response;
  }
}
