import axios from "axios";
import { authConfig } from "../../../../config";
import {
  InitializedResponse,
  InitializeRequest,
  IPaymentService,
  VerifyResponse
} from "../paymentService";

export class PayStackPaymentService implements IPaymentService {
  private secretKey: string;
  private baseUrl: string;
  public serviceName: string;
  constructor() {
    this.secretKey = `Bearer ${authConfig.payStackSecretKey}`;
    this.baseUrl = `https://api.paystack.co/transaction`;
    this.serviceName = "paystack";
  }

  requestConfig() {
    const config = {
      headers: {
        authorization: this.secretKey,
        "content-type": "application/json",
        "cache-control": "no-cache"
      }
    };
    return config;
  }

  async initializePayment(
    request: InitializeRequest
  ): Promise<InitializedResponse> {
    const url = `${this.baseUrl}/initialize/`;
    const config = this.requestConfig();
    const axiosResponse = await axios.post(url, request, config);
    const response: InitializedResponse = axiosResponse.data;
    return response;
  }

  async verifyPayment(reference: string): Promise<VerifyResponse> {
    const transactionReference = encodeURIComponent(reference);
    const url = `${this.baseUrl}/verify/${transactionReference}`;
    const config = this.requestConfig();
    const axiosResponse = await axios.get(url, config);
    const response: VerifyResponse = axiosResponse.data;
    return response;
  }
}
