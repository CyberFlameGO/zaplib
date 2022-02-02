export type Initialize = (initParams: {
  filename: string;
  baseUri?: string;
  defaultStyles?: boolean;
}) => Promise<void>;

export type UniformType =
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat2"
  | "mat3"
  | "mat4";
export type Uniform = { ty: UniformType; name: string };

export type ShaderAttributes = {
  shaderId: number;
  fragment: string;
  vertex: string;
  geometrySlots: number;
  instanceSlots: number;
  passUniforms: Uniform[];
  viewUniforms: Uniform[];
  drawUniforms: Uniform[];
  userUniforms: Uniform[];
  textureSlots: Uniform[];
};

export type Texture = WebGLTexture & {
  mpWidth: number;
  mpHeight: number;
};

export type FileHandle = {
  id: number;
  basename: string;
  file: File;
  lastReadStart: number;
  lastReadEnd: number;
};

export type WasmEnv = {
  memory: WebAssembly.Memory;
  _consoleLog: (charsPtr: string, len: string, error: any) => void;
  readUserFileRange: (
    userFileId: number,
    bufPtr: number,
    bufLen: number,
    fileOffset: number
  ) => BigInt;
  performanceNow: () => number;
  threadSpawn: (ctxPtr: BigInt) => void;
  _sendEventFromAnyThread: (eventPtr: BigInt) => void;
  readUrlSync: (
    urlPtr: number,
    urlLen: number,
    bufPtrOut: number,
    bufLenOut: number
  ) => 1 | 0;
  randomU64: () => BigInt;
  sendTaskWorkerMessage: (twMessagePtr: string) => void;
};

export type WasmExports = {
  allocWasmVec: (bytes: BigInt) => BigInt;
  allocWasmMessage: (bytes: BigInt) => BigInt;
  deallocWasmMessage: (inBuf: BigInt) => void;
  reallocWasmMessage: (inBuf: BigInt, newBytes: BigInt) => BigInt;
  createWasmApp: () => BigInt;
  processWasmEvents: (appcx: BigInt, msgBytes: BigInt) => BigInt;
  decrementArc: (arcPtr: BigInt) => void;
  callRustInSameThreadSync: (appcx: BigInt, msgBytes: BigInt) => BigInt;
  incrementArc: (arcPtr: BigInt) => void;
  createArcVec: (vecPtr: BigInt, vecLen: BigInt, paramType: BigInt) => BigInt;
  deallocVec: (vecPtr: BigInt, vecLen: BigInt, vecCap: BigInt) => BigInt;
  runFunctionPointer: (ctxPtr: BigInt) => void;
  // __tls_size and __wasm_init_tls are automatically generated; see e.g.
  // https://github.com/WebAssembly/tool-conventions/blob/main/Linking.md#thread-local-storage
  // eslint-disable-next-line camelcase
  __tls_size: { value: number };
  // eslint-disable-next-line camelcase
  __wasm_init_tls: (ptr: number) => void;
  // The "shadow stack" pointer is usually a private variable generated by LLVM, but we expose
  // it in build_wasm.sh. See also:
  // - https://github.com/rustwasm/wasm-bindgen/blob/ac87c8215bdd28d6aa0e12705996238a78227f8c/crates/wasm-conventions/src/lib.rs#L36
  // - https://github.com/WebAssembly/tool-conventions/blob/main/Linking.md#merging-global-sections
  // eslint-disable-next-line camelcase
  __stack_pointer: { value: number };
};

type BufferDataCommon = {
  bufferPtr: number;
  bufferLen: number;
  paramType: ZapParamType;
};
export type ReadonlyBufferData = BufferDataCommon & {
  readonly: true;
  arcPtr: number;
};
export type MutableBufferData = BufferDataCommon & {
  readonly: false;
  bufferCap: number;
};
export type BufferData = ReadonlyBufferData | MutableBufferData;

export type PostMessageTypedArray = {
  bufferData: BufferData;
  byteOffset: number;
  byteLength: number;
};

export type ZapArray = Uint8Array | Float32Array;
export type ZapParam = ZapArray | string;
export type RustZapParam = BufferData | string;

// TODO(JP): We currently have a different interface for `createMutableBuffer`
// and `createReadOnlyBuffer` between the main thread and workers, because
// we currently don't run a Wasm instance in the main thread. However, we
// should be able to fix that by using spinlocks on the main thread (allocations
// should typically already use this!).
export type CreateBuffer = <T extends ZapArray>(data: T) => Promise<T>;
export type CreateBufferWorkerSync = <T extends ZapArray>(data: T) => T;

export type CallJsCallback = (params: ZapParam[]) => void;

export type CallRust = (
  name: string,
  params?: ZapParam[]
) => Promise<ZapParam[]>;

export type CallRustInSameThreadSync = (
  ...args: Parameters<CallRust>
) => ZapParam[];

// Keep in sync with `param.rs`
export enum ZapParamType {
  String = 0,
  ReadOnlyU8Buffer = 1,
  U8Buffer = 2,
  F32Buffer = 3,
  ReadOnlyF32Buffer = 4,
}

export type SizingData = {
  width: number;
  height: number;
  dpiFactor: number;
  canFullscreen: boolean;
  isFullscreen: boolean;
};

export type TlsAndStackData = {
  ptr: BigInt;
  size: number;
};
