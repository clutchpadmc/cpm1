// @generated by protoc-gen-es v1.2.1 with parameter "target=ts"
// @generated from file aiserver/v1/docs.proto (package aiserver.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message aiserver.v1.DocumentationMetadata
 */
export class DocumentationMetadata extends Message<DocumentationMetadata> {
  /**
   * We call this origin url now
   *
   * @generated from field: string prefix_url = 1;
   */
  prefixUrl = "";

  /**
   * @generated from field: string doc_name = 2;
   */
  docName = "";

  /**
   * @generated from field: bool is_different_prefix_origin = 3;
   */
  isDifferentPrefixOrigin = false;

  /**
   * @generated from field: string true_prefix_url = 4;
   */
  truePrefixUrl = "";

  /**
   * @generated from field: bool public = 5;
   */
  public = false;

  constructor(data?: PartialMessage<DocumentationMetadata>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.DocumentationMetadata";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "prefix_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "doc_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "is_different_prefix_origin", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "true_prefix_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "public", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DocumentationMetadata {
    return new DocumentationMetadata().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DocumentationMetadata {
    return new DocumentationMetadata().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DocumentationMetadata {
    return new DocumentationMetadata().fromJsonString(jsonString, options);
  }

  static equals(a: DocumentationMetadata | PlainMessage<DocumentationMetadata> | undefined, b: DocumentationMetadata | PlainMessage<DocumentationMetadata> | undefined): boolean {
    return proto3.util.equals(DocumentationMetadata, a, b);
  }
}

/**
 * @generated from message aiserver.v1.DocumentationChunk
 */
export class DocumentationChunk extends Message<DocumentationChunk> {
  /**
   * @generated from field: string doc_name = 1;
   */
  docName = "";

  /**
   * @generated from field: string page_url = 2;
   */
  pageUrl = "";

  /**
   * @generated from field: string documentation_chunk = 3;
   */
  documentationChunk = "";

  /**
   * @generated from field: float score = 4;
   */
  score = 0;

  constructor(data?: PartialMessage<DocumentationChunk>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.DocumentationChunk";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "doc_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "page_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "documentation_chunk", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "score", kind: "scalar", T: 2 /* ScalarType.FLOAT */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DocumentationChunk {
    return new DocumentationChunk().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DocumentationChunk {
    return new DocumentationChunk().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DocumentationChunk {
    return new DocumentationChunk().fromJsonString(jsonString, options);
  }

  static equals(a: DocumentationChunk | PlainMessage<DocumentationChunk> | undefined, b: DocumentationChunk | PlainMessage<DocumentationChunk> | undefined): boolean {
    return proto3.util.equals(DocumentationChunk, a, b);
  }
}

/**
 * @generated from message aiserver.v1.DocumentationQueryRequest
 */
export class DocumentationQueryRequest extends Message<DocumentationQueryRequest> {
  /**
   * @generated from field: string doc_identifier = 1;
   */
  docIdentifier = "";

  /**
   * @generated from field: string query = 2;
   */
  query = "";

  /**
   * @generated from field: uint32 top_k = 3;
   */
  topK = 0;

  /**
   * @generated from field: bool rerank_results = 4;
   */
  rerankResults = false;

  constructor(data?: PartialMessage<DocumentationQueryRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.DocumentationQueryRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "doc_identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "query", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "top_k", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 4, name: "rerank_results", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DocumentationQueryRequest {
    return new DocumentationQueryRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DocumentationQueryRequest {
    return new DocumentationQueryRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DocumentationQueryRequest {
    return new DocumentationQueryRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DocumentationQueryRequest | PlainMessage<DocumentationQueryRequest> | undefined, b: DocumentationQueryRequest | PlainMessage<DocumentationQueryRequest> | undefined): boolean {
    return proto3.util.equals(DocumentationQueryRequest, a, b);
  }
}

/**
 * @generated from message aiserver.v1.DocumentationQueryResponse
 */
export class DocumentationQueryResponse extends Message<DocumentationQueryResponse> {
  /**
   * @generated from field: string doc_identifier = 1;
   */
  docIdentifier = "";

  /**
   * @generated from field: string doc_name = 2;
   */
  docName = "";

  /**
   * @generated from field: repeated aiserver.v1.DocumentationChunk doc_chunks = 3;
   */
  docChunks: DocumentationChunk[] = [];

  /**
   * @generated from field: aiserver.v1.DocumentationQueryResponse.Status status = 4;
   */
  status = DocumentationQueryResponse_Status.UNSPECIFIED;

  constructor(data?: PartialMessage<DocumentationQueryResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.DocumentationQueryResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "doc_identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "doc_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "doc_chunks", kind: "message", T: DocumentationChunk, repeated: true },
    { no: 4, name: "status", kind: "enum", T: proto3.getEnumType(DocumentationQueryResponse_Status) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DocumentationQueryResponse {
    return new DocumentationQueryResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DocumentationQueryResponse {
    return new DocumentationQueryResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DocumentationQueryResponse {
    return new DocumentationQueryResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DocumentationQueryResponse | PlainMessage<DocumentationQueryResponse> | undefined, b: DocumentationQueryResponse | PlainMessage<DocumentationQueryResponse> | undefined): boolean {
    return proto3.util.equals(DocumentationQueryResponse, a, b);
  }
}

/**
 * @generated from enum aiserver.v1.DocumentationQueryResponse.Status
 */
export enum DocumentationQueryResponse_Status {
  /**
   * @generated from enum value: STATUS_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: STATUS_NOT_FOUND = 1;
   */
  NOT_FOUND = 1,

  /**
   * @generated from enum value: STATUS_SUCCESS = 2;
   */
  SUCCESS = 2,

  /**
   * @generated from enum value: STATUS_FAILURE = 3;
   */
  FAILURE = 3,
}
// Retrieve enum metadata with: proto3.getEnumType(DocumentationQueryResponse_Status)
proto3.util.setEnumType(DocumentationQueryResponse_Status, "aiserver.v1.DocumentationQueryResponse.Status", [
  { no: 0, name: "STATUS_UNSPECIFIED" },
  { no: 1, name: "STATUS_NOT_FOUND" },
  { no: 2, name: "STATUS_SUCCESS" },
  { no: 3, name: "STATUS_FAILURE" },
]);

