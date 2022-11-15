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
  private timesVerifyPaymentCalled: number;
  private currentResponseStatus: boolean;
  private currentVerifyPaymentStatusMessage: "success" | "abandoned" | "failed";

  constructor() {
    this.serviceName = "paymentServiceSpy";
    this.timesInitializePaymentCalled = 0;
    this.timesVerifyPaymentCalled = 0;
    this.currentResponseStatus = true;
    this.currentVerifyPaymentStatusMessage = "success";
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

  getTimesVerifyPaymentCalled(): number {
    return this.timesVerifyPaymentCalled;
  }

  changeVerifyPaymentDataStatus(
    status: "success" | "abandoned" | "failed"
  ): void {
    this.currentVerifyPaymentStatusMessage = status;
  }

  getCurrentVerifyPaymentDataStatus() {
    return this.currentVerifyPaymentStatusMessage;
  }

  async verifyPayment(reference: string): Promise<VerifyResponse> {
    const response: VerifyResponse = {
      status: true,
      message: this.currentResponseStatus ? "verified" : "failed to verify",
      data: {
        amount: Math.floor(Math.random() * (100 - 30 + 1)) + 30,
        status: this.currentVerifyPaymentStatusMessage,
        reference
      }
    };
    this.timesVerifyPaymentCalled++;

    return response;
  }
}
