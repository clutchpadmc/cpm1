// @generated by protoc-gen-es v1.2.1 with parameter "target=ts"
// @generated from file aiserver/v1/auth.proto (package aiserver.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message aiserver.v1.GetEmailRequest
 */
export class GetEmailRequest extends Message<GetEmailRequest> {
  constructor(data?: PartialMessage<GetEmailRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.GetEmailRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEmailRequest {
    return new GetEmailRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEmailRequest {
    return new GetEmailRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEmailRequest {
    return new GetEmailRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetEmailRequest | PlainMessage<GetEmailRequest> | undefined, b: GetEmailRequest | PlainMessage<GetEmailRequest> | undefined): boolean {
    return proto3.util.equals(GetEmailRequest, a, b);
  }
}

/**
 * @generated from message aiserver.v1.GetEmailResponse
 */
export class GetEmailResponse extends Message<GetEmailResponse> {
  /**
   * @generated from field: string email = 1;
   */
  email = "";

  constructor(data?: PartialMessage<GetEmailResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.GetEmailResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEmailResponse {
    return new GetEmailResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEmailResponse {
    return new GetEmailResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEmailResponse {
    return new GetEmailResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetEmailResponse | PlainMessage<GetEmailResponse> | undefined, b: GetEmailResponse | PlainMessage<GetEmailResponse> | undefined): boolean {
    return proto3.util.equals(GetEmailResponse, a, b);
  }
}

/**
 * @generated from message aiserver.v1.EmailValidRequest
 */
export class EmailValidRequest extends Message<EmailValidRequest> {
  /**
   * @generated from field: string email = 1;
   */
  email = "";

  constructor(data?: PartialMessage<EmailValidRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.EmailValidRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EmailValidRequest {
    return new EmailValidRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EmailValidRequest {
    return new EmailValidRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EmailValidRequest {
    return new EmailValidRequest().fromJsonString(jsonString, options);
  }

  static equals(a: EmailValidRequest | PlainMessage<EmailValidRequest> | undefined, b: EmailValidRequest | PlainMessage<EmailValidRequest> | undefined): boolean {
    return proto3.util.equals(EmailValidRequest, a, b);
  }
}

/**
 * @generated from message aiserver.v1.EmailValidResponse
 */
export class EmailValidResponse extends Message<EmailValidResponse> {
  /**
   * @generated from field: bool valid = 1;
   */
  valid = false;

  constructor(data?: PartialMessage<EmailValidResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.EmailValidResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "valid", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EmailValidResponse {
    return new EmailValidResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EmailValidResponse {
    return new EmailValidResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EmailValidResponse {
    return new EmailValidResponse().fromJsonString(jsonString, options);
  }

  static equals(a: EmailValidResponse | PlainMessage<EmailValidResponse> | undefined, b: EmailValidResponse | PlainMessage<EmailValidResponse> | undefined): boolean {
    return proto3.util.equals(EmailValidResponse, a, b);
  }
}

