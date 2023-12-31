// @generated by protoc-gen-es v1.2.1 with parameter "target=ts"
// @generated from file aiserver/v1/cmdk.proto (package aiserver.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { ContextStatusUpdate, MissingContextItems, PotentiallyCachedContextItem } from './context_pb';
import { CodeBlock, ExplicitContext, ModelDetails } from './utils_pb';

/**
 * it's possible we want to make a generic version of this
 * for now, i am doing it cmd-k specific, to make sure i don't overengineer
 *
 * @generated from message aiserver.v1.RerankCmdKContextRequest
 */
export class RerankCmdKContextRequest extends Message<RerankCmdKContextRequest> {
  /**
   * all chunks are serialized on the client, and then just sent up to the server to be reranked
   * if the server doesn't have the hash of a particular context item, it notifies the client by sending the hash in response, which initiaties a new request with the new items
   * these items always include ALL context items under consideration, even if they have been reranked before
   * the server does all the necessary caching
   * these are sent up *in no order*
   *
   * @generated from field: repeated aiserver.v1.PotentiallyCachedContextItem context_items = 1;
   */
  contextItems: PotentiallyCachedContextItem[] = [];

  /**
   * @generated from field: aiserver.v1.CmdKOptions cmd_k_options = 2;
   */
  cmdKOptions?: CmdKOptions;

  constructor(data?: PartialMessage<RerankCmdKContextRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.RerankCmdKContextRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "context_items", kind: "message", T: PotentiallyCachedContextItem, repeated: true },
    { no: 2, name: "cmd_k_options", kind: "message", T: CmdKOptions },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RerankCmdKContextRequest {
    return new RerankCmdKContextRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RerankCmdKContextRequest {
    return new RerankCmdKContextRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RerankCmdKContextRequest {
    return new RerankCmdKContextRequest().fromJsonString(jsonString, options);
  }

  static equals(a: RerankCmdKContextRequest | PlainMessage<RerankCmdKContextRequest> | undefined, b: RerankCmdKContextRequest | PlainMessage<RerankCmdKContextRequest> | undefined): boolean {
    return proto3.util.equals(RerankCmdKContextRequest, a, b);
  }
}

/**
 * @generated from message aiserver.v1.RerankCmdKContextResponse
 */
export class RerankCmdKContextResponse extends Message<RerankCmdKContextResponse> {
  /**
   * @generated from oneof aiserver.v1.RerankCmdKContextResponse.response
   */
  response: {
    /**
     * @generated from field: aiserver.v1.ContextStatusUpdate context_status_update = 1;
     */
    value: ContextStatusUpdate;
    case: "contextStatusUpdate";
  } | {
    /**
     * @generated from field: aiserver.v1.MissingContextItems missing_context_items = 2;
     */
    value: MissingContextItems;
    case: "missingContextItems";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<RerankCmdKContextResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.RerankCmdKContextResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "context_status_update", kind: "message", T: ContextStatusUpdate, oneof: "response" },
    { no: 2, name: "missing_context_items", kind: "message", T: MissingContextItems, oneof: "response" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RerankCmdKContextResponse {
    return new RerankCmdKContextResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RerankCmdKContextResponse {
    return new RerankCmdKContextResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RerankCmdKContextResponse {
    return new RerankCmdKContextResponse().fromJsonString(jsonString, options);
  }

  static equals(a: RerankCmdKContextResponse | PlainMessage<RerankCmdKContextResponse> | undefined, b: RerankCmdKContextResponse | PlainMessage<RerankCmdKContextResponse> | undefined): boolean {
    return proto3.util.equals(RerankCmdKContextResponse, a, b);
  }
}

/**
 * @generated from message aiserver.v1.CmdKOptions
 */
export class CmdKOptions extends Message<CmdKOptions> {
  /**
   * @generated from field: aiserver.v1.ModelDetails model_details = 3;
   */
  modelDetails?: ModelDetails;

  constructor(data?: PartialMessage<CmdKOptions>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.CmdKOptions";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 3, name: "model_details", kind: "message", T: ModelDetails },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CmdKOptions {
    return new CmdKOptions().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CmdKOptions {
    return new CmdKOptions().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CmdKOptions {
    return new CmdKOptions().fromJsonString(jsonString, options);
  }

  static equals(a: CmdKOptions | PlainMessage<CmdKOptions> | undefined, b: CmdKOptions | PlainMessage<CmdKOptions> | undefined): boolean {
    return proto3.util.equals(CmdKOptions, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKRequest
 */
export class StreamCmdKRequest extends Message<StreamCmdKRequest> {
  /**
   * all context items are included here too!
   * NOTE: EVERYTHING THAT GOES INTO THE PROMPT SHOULD GO INTO A CONTEXT ITEM
   * this includes the query itself! this is so that we can easily rerank, and do things like compress the query
   * ARVIDTODO: should we send up the cached status of the context items if we have them?
   * say for codebase chunks, where fall back to the reranked chunks always.
   * if the server has deleted the cache of the reranked chunk, won't we really want
   * to know the score in that case?
   * that hinges on whether the reranking score is absolute or comparative, which isn't obvious to me yet
   * i think for now it is probably safe to assume that the reranker score will be cached by the server, but we should pay attention to this
   *
   * @generated from field: repeated aiserver.v1.PotentiallyCachedContextItem context_items = 1;
   */
  contextItems: PotentiallyCachedContextItem[] = [];

  /**
   * @generated from field: aiserver.v1.CmdKOptions cmd_k_options = 2;
   */
  cmdKOptions?: CmdKOptions;

  /**
   * only sent up if the user has enabled the cmd-k debug info flag
   *
   * @generated from field: aiserver.v1.CmdKDebugInfo cmd_k_debug_info = 4;
   */
  cmdKDebugInfo?: CmdKDebugInfo;

  /**
   * this is hacky, but.... we do it so we can ship as fast as possible
   * refactors are annoying....
   * here we include all context that the old streamEdit got. we then hydrate it and turn it into context items on the server. this has some disadvantages (e.g. the reranking won't considering everything, and won't be accurate in terms of saying what goes into the prompt and what is left out)
   *
   * @generated from field: aiserver.v1.CmdKLegacyContext legacy_context = 5;
   */
  legacyContext?: CmdKLegacyContext;

  constructor(data?: PartialMessage<StreamCmdKRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "context_items", kind: "message", T: PotentiallyCachedContextItem, repeated: true },
    { no: 2, name: "cmd_k_options", kind: "message", T: CmdKOptions },
    { no: 4, name: "cmd_k_debug_info", kind: "message", T: CmdKDebugInfo },
    { no: 5, name: "legacy_context", kind: "message", T: CmdKLegacyContext },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKRequest {
    return new StreamCmdKRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKRequest {
    return new StreamCmdKRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKRequest {
    return new StreamCmdKRequest().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKRequest | PlainMessage<StreamCmdKRequest> | undefined, b: StreamCmdKRequest | PlainMessage<StreamCmdKRequest> | undefined): boolean {
    return proto3.util.equals(StreamCmdKRequest, a, b);
  }
}

/**
 * legacy context! i'm not super proud of it, but it allows us to ship fast
 *
 * @generated from message aiserver.v1.CmdKLegacyContext
 */
export class CmdKLegacyContext extends Message<CmdKLegacyContext> {
  /**
   * @generated from field: aiserver.v1.ExplicitContext explicit_context = 4;
   */
  explicitContext?: ExplicitContext;

  /**
   * @generated from field: repeated aiserver.v1.CodeBlock prompt_code_blocks = 12;
   */
  promptCodeBlocks: CodeBlock[] = [];

  /**
   * @generated from field: repeated string documentation_identifiers = 10;
   */
  documentationIdentifiers: string[] = [];

  constructor(data?: PartialMessage<CmdKLegacyContext>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.CmdKLegacyContext";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 4, name: "explicit_context", kind: "message", T: ExplicitContext },
    { no: 12, name: "prompt_code_blocks", kind: "message", T: CodeBlock, repeated: true },
    { no: 10, name: "documentation_identifiers", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CmdKLegacyContext {
    return new CmdKLegacyContext().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CmdKLegacyContext {
    return new CmdKLegacyContext().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CmdKLegacyContext {
    return new CmdKLegacyContext().fromJsonString(jsonString, options);
  }

  static equals(a: CmdKLegacyContext | PlainMessage<CmdKLegacyContext> | undefined, b: CmdKLegacyContext | PlainMessage<CmdKLegacyContext> | undefined): boolean {
    return proto3.util.equals(CmdKLegacyContext, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKResponseContextWrapped
 */
export class StreamCmdKResponseContextWrapped extends Message<StreamCmdKResponseContextWrapped> {
  /**
   * @generated from oneof aiserver.v1.StreamCmdKResponseContextWrapped.response
   */
  response: {
    /**
     * @generated from field: aiserver.v1.StreamCmdKResponse real_response = 1;
     */
    value: StreamCmdKResponse;
    case: "realResponse";
  } | {
    /**
     * the final statuses are being sent down
     * ARVIDTODO: it is possible we want to send down two of these: one at the start (just to definitively show what was in the prompt), and one at the end (with the post-generation evaluation)
     *
     * @generated from field: aiserver.v1.ContextStatusUpdate context_status_update = 2;
     */
    value: ContextStatusUpdate;
    case: "contextStatusUpdate";
  } | {
    /**
     * if we have any missing context hashes, we send back them here, so that we can retry the request immediately. this should rarely happen: only if something bad happens on the server, like we restart redis or something!
     *
     * @generated from field: aiserver.v1.MissingContextItems missing_context_items = 3;
     */
    value: MissingContextItems;
    case: "missingContextItems";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<StreamCmdKResponseContextWrapped>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponseContextWrapped";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "real_response", kind: "message", T: StreamCmdKResponse, oneof: "response" },
    { no: 2, name: "context_status_update", kind: "message", T: ContextStatusUpdate, oneof: "response" },
    { no: 3, name: "missing_context_items", kind: "message", T: MissingContextItems, oneof: "response" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponseContextWrapped {
    return new StreamCmdKResponseContextWrapped().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponseContextWrapped {
    return new StreamCmdKResponseContextWrapped().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponseContextWrapped {
    return new StreamCmdKResponseContextWrapped().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponseContextWrapped | PlainMessage<StreamCmdKResponseContextWrapped> | undefined, b: StreamCmdKResponseContextWrapped | PlainMessage<StreamCmdKResponseContextWrapped> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponseContextWrapped, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKResponse
 */
export class StreamCmdKResponse extends Message<StreamCmdKResponse> {
  /**
   * @generated from oneof aiserver.v1.StreamCmdKResponse.response
   */
  response: {
    /**
     * @generated from field: aiserver.v1.StreamCmdKResponse.EditStart edit_start = 1;
     */
    value: StreamCmdKResponse_EditStart;
    case: "editStart";
  } | {
    /**
     * @generated from field: aiserver.v1.StreamCmdKResponse.EditStream edit_stream = 2;
     */
    value: StreamCmdKResponse_EditStream;
    case: "editStream";
  } | {
    /**
     * @generated from field: aiserver.v1.StreamCmdKResponse.EditEnd edit_end = 3;
     */
    value: StreamCmdKResponse_EditEnd;
    case: "editEnd";
  } | {
    /**
     * @generated from field: aiserver.v1.StreamCmdKResponse.Chat chat = 4;
     */
    value: StreamCmdKResponse_Chat;
    case: "chat";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<StreamCmdKResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "edit_start", kind: "message", T: StreamCmdKResponse_EditStart, oneof: "response" },
    { no: 2, name: "edit_stream", kind: "message", T: StreamCmdKResponse_EditStream, oneof: "response" },
    { no: 3, name: "edit_end", kind: "message", T: StreamCmdKResponse_EditEnd, oneof: "response" },
    { no: 4, name: "chat", kind: "message", T: StreamCmdKResponse_Chat, oneof: "response" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponse {
    return new StreamCmdKResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponse {
    return new StreamCmdKResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponse {
    return new StreamCmdKResponse().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponse | PlainMessage<StreamCmdKResponse> | undefined, b: StreamCmdKResponse | PlainMessage<StreamCmdKResponse> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponse, a, b);
  }
}

/**
 * the server does NOT guarantee that the edits come in order
 * (at least not for now)
 * the server DOES guarantee that the edits do not overlap in the original text file
 * we always stream complete lines. if two lines are streamed in, they start from the first column and they end at the end of the second line. the total string will include exactly one line break, which will always use \n only for line breaks, regardless of what the original file uses
 *
 * @generated from message aiserver.v1.StreamCmdKResponse.EditStart
 */
export class StreamCmdKResponse_EditStart extends Message<StreamCmdKResponse_EditStart> {
  /**
   * this is the 1-indexed line number in the *original* file that was sent up in the request
   * it is the client's responsibility to map this to the new line number in case the text model has changed in the meantime
   * the diff algorithm should not have to care about the end line number
   *
   * @generated from field: int32 start_line_number = 1;
   */
  startLineNumber = 0;

  /**
   * each edit has a different ID. we're not using uuid since that would blow up the response size by like 10x lol
   *
   * @generated from field: int32 edit_id = 2;
   */
  editId = 0;

  /**
   * edits can also have a max end line number. this will be overriden by the final end line number, but can be useful to control the diff algorithm
   * e.g. if you're in between lines A and A, and say "insert another A", then without the max end line number, the diff algorithm will match the inserted A with the existing A, instead of inserting a new A
   *
   * @generated from field: optional int32 max_end_line_number_exclusive = 3;
   */
  maxEndLineNumberExclusive?: number;

  constructor(data?: PartialMessage<StreamCmdKResponse_EditStart>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponse.EditStart";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "start_line_number", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "edit_id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "max_end_line_number_exclusive", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponse_EditStart {
    return new StreamCmdKResponse_EditStart().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditStart {
    return new StreamCmdKResponse_EditStart().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditStart {
    return new StreamCmdKResponse_EditStart().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponse_EditStart | PlainMessage<StreamCmdKResponse_EditStart> | undefined, b: StreamCmdKResponse_EditStart | PlainMessage<StreamCmdKResponse_EditStart> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponse_EditStart, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKResponse.EditStream
 */
export class StreamCmdKResponse_EditStream extends Message<StreamCmdKResponse_EditStream> {
  /**
   * always using \n to indicate a line break. never \r\n
   * on the client, we will pad with \r if the original file uses \r\n, to make sure everything is consistent
   *
   * @generated from field: string text = 1;
   */
  text = "";

  /**
   * @generated from field: int32 edit_id = 2;
   */
  editId = 0;

  constructor(data?: PartialMessage<StreamCmdKResponse_EditStream>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponse.EditStream";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "edit_id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponse_EditStream {
    return new StreamCmdKResponse_EditStream().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditStream {
    return new StreamCmdKResponse_EditStream().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditStream {
    return new StreamCmdKResponse_EditStream().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponse_EditStream | PlainMessage<StreamCmdKResponse_EditStream> | undefined, b: StreamCmdKResponse_EditStream | PlainMessage<StreamCmdKResponse_EditStream> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponse_EditStream, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKResponse.EditEnd
 */
export class StreamCmdKResponse_EditEnd extends Message<StreamCmdKResponse_EditEnd> {
  /**
   * we use exclusive here to make it possible to do pure inserts (then the start_line_number == end_line_number_exclusive)
   *
   * @generated from field: int32 end_line_number_exclusive = 1;
   */
  endLineNumberExclusive = 0;

  /**
   * @generated from field: int32 edit_id = 2;
   */
  editId = 0;

  constructor(data?: PartialMessage<StreamCmdKResponse_EditEnd>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponse.EditEnd";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "end_line_number_exclusive", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "edit_id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponse_EditEnd {
    return new StreamCmdKResponse_EditEnd().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditEnd {
    return new StreamCmdKResponse_EditEnd().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponse_EditEnd {
    return new StreamCmdKResponse_EditEnd().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponse_EditEnd | PlainMessage<StreamCmdKResponse_EditEnd> | undefined, b: StreamCmdKResponse_EditEnd | PlainMessage<StreamCmdKResponse_EditEnd> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponse_EditEnd, a, b);
  }
}

/**
 * @generated from message aiserver.v1.StreamCmdKResponse.Chat
 */
export class StreamCmdKResponse_Chat extends Message<StreamCmdKResponse_Chat> {
  /**
   * usually markdown
   *
   * @generated from field: string text = 1;
   */
  text = "";

  constructor(data?: PartialMessage<StreamCmdKResponse_Chat>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.StreamCmdKResponse.Chat";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StreamCmdKResponse_Chat {
    return new StreamCmdKResponse_Chat().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StreamCmdKResponse_Chat {
    return new StreamCmdKResponse_Chat().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StreamCmdKResponse_Chat {
    return new StreamCmdKResponse_Chat().fromJsonString(jsonString, options);
  }

  static equals(a: StreamCmdKResponse_Chat | PlainMessage<StreamCmdKResponse_Chat> | undefined, b: StreamCmdKResponse_Chat | PlainMessage<StreamCmdKResponse_Chat> | undefined): boolean {
    return proto3.util.equals(StreamCmdKResponse_Chat, a, b);
  }
}

/**
 * @generated from message aiserver.v1.CmdKDebugInfo
 */
export class CmdKDebugInfo extends Message<CmdKDebugInfo> {
  /**
   * we only support one remote URL for now. mostly internal
   *
   * @generated from field: string remote_url = 1;
   */
  remoteUrl = "";

  /**
   * @generated from field: string commit_id = 2;
   */
  commitId = "";

  /**
   * @generated from field: string git_patch = 3;
   */
  gitPatch = "";

  /**
   * @generated from field: repeated aiserver.v1.CmdKDebugInfo.UnsavedFiles unsaved_files = 4;
   */
  unsavedFiles: CmdKDebugInfo_UnsavedFiles[] = [];

  constructor(data?: PartialMessage<CmdKDebugInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.CmdKDebugInfo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "remote_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "commit_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "git_patch", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "unsaved_files", kind: "message", T: CmdKDebugInfo_UnsavedFiles, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CmdKDebugInfo {
    return new CmdKDebugInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CmdKDebugInfo {
    return new CmdKDebugInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CmdKDebugInfo {
    return new CmdKDebugInfo().fromJsonString(jsonString, options);
  }

  static equals(a: CmdKDebugInfo | PlainMessage<CmdKDebugInfo> | undefined, b: CmdKDebugInfo | PlainMessage<CmdKDebugInfo> | undefined): boolean {
    return proto3.util.equals(CmdKDebugInfo, a, b);
  }
}

/**
 * @generated from message aiserver.v1.CmdKDebugInfo.UnsavedFiles
 */
export class CmdKDebugInfo_UnsavedFiles extends Message<CmdKDebugInfo_UnsavedFiles> {
  /**
   * @generated from field: string relative_workspace_path = 1;
   */
  relativeWorkspacePath = "";

  /**
   * @generated from field: string contents = 2;
   */
  contents = "";

  constructor(data?: PartialMessage<CmdKDebugInfo_UnsavedFiles>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "aiserver.v1.CmdKDebugInfo.UnsavedFiles";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "relative_workspace_path", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "contents", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CmdKDebugInfo_UnsavedFiles {
    return new CmdKDebugInfo_UnsavedFiles().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CmdKDebugInfo_UnsavedFiles {
    return new CmdKDebugInfo_UnsavedFiles().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CmdKDebugInfo_UnsavedFiles {
    return new CmdKDebugInfo_UnsavedFiles().fromJsonString(jsonString, options);
  }

  static equals(a: CmdKDebugInfo_UnsavedFiles | PlainMessage<CmdKDebugInfo_UnsavedFiles> | undefined, b: CmdKDebugInfo_UnsavedFiles | PlainMessage<CmdKDebugInfo_UnsavedFiles> | undefined): boolean {
    return proto3.util.equals(CmdKDebugInfo_UnsavedFiles, a, b);
  }
}

