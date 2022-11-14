export interface InitializeRequest {
  email: string;
  amount: number;
  currency: "NGN";
}

export interface InitializedResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    status: "success" | "abandoned" | "failed";
    reference: string;
  };
}

export interface IPaymentService {
  serviceName: string;
  initializePayment(request: InitializeRequest): Promise<InitializedResponse>;
  verifyPayment(reference: string): Promise<VerifyResponse>;
}
