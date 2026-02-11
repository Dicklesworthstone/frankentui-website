/* tslint:disable */
/* eslint-disable */

/**
 * WASM showcase runner for the FrankenTUI demo application.
 *
 * Host-driven: JavaScript controls the event loop via `requestAnimationFrame`,
 * pushing input events and advancing time each frame.
 */
export class ShowcaseRunner {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Advance deterministic clock by `dt_ms` milliseconds (real-time mode).
     */
    advanceTime(dt_ms: number): void;
    /**
     * Release internal resources.
     */
    destroy(): void;
    /**
     * Current frame index (monotonic, 0-based).
     */
    frameIdx(): bigint;
    /**
     * Initialize the model and render the first frame. Call exactly once.
     */
    init(): void;
    /**
     * Whether the program is still running.
     */
    isRunning(): boolean;
    /**
     * Create a new runner with initial terminal dimensions (cols, rows).
     */
    constructor(cols: number, rows: number);
    /**
     * FNV-1a hash of the last patch batch, or `null`.
     */
    patchHash(): string | undefined;
    /**
     * Patch upload stats: `{ dirty_cells, patch_count, bytes_uploaded }`, or `null`.
     */
    patchStats(): any;
    /**
     * Parse a JSON-encoded input and push to the event queue.
     * Returns `true` if accepted, `false` if unsupported/malformed.
     */
    pushEncodedInput(json: string): boolean;
    /**
     * Resize the terminal (pushes Resize event, processed on next step).
     */
    resize(cols: number, rows: number): void;
    /**
     * Provide the Shakespeare text blob for the `Shakespeare` screen.
     *
     * For WASM builds we avoid embedding multi-megabyte strings in the module.
     * The host should call this once during startup (or early in the session).
     */
    setShakespeareText(text: string): boolean;
    /**
     * Provide the SQLite amalgamation source for the `CodeExplorer` screen.
     *
     * For WASM builds we avoid embedding multi-megabyte strings in the module.
     * The host should call this once during startup (or early in the session).
     */
    setSqliteSource(text: string): boolean;
    /**
     * Set deterministic clock to absolute nanoseconds (replay mode).
     */
    setTime(ts_ns: number): void;
    /**
     * Process pending events and render if dirty.
     * Returns `{ running, rendered, events_processed, frame_idx }`.
     */
    step(): any;
    /**
     * Take flat patch batch for GPU upload.
     * Returns `{ cells: Uint32Array, spans: Uint32Array }`.
     */
    takeFlatPatches(): any;
    /**
     * Drain accumulated log lines. Returns `Array<string>`.
     */
    takeLogs(): Array<any>;
}

export function wasm_start(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_showcaserunner_free: (a: number, b: number) => void;
    readonly showcaserunner_advanceTime: (a: number, b: number) => void;
    readonly showcaserunner_destroy: (a: number) => void;
    readonly showcaserunner_frameIdx: (a: number) => bigint;
    readonly showcaserunner_init: (a: number) => void;
    readonly showcaserunner_isRunning: (a: number) => number;
    readonly showcaserunner_new: (a: number, b: number) => number;
    readonly showcaserunner_patchHash: (a: number, b: number) => void;
    readonly showcaserunner_patchStats: (a: number) => number;
    readonly showcaserunner_pushEncodedInput: (a: number, b: number, c: number) => number;
    readonly showcaserunner_resize: (a: number, b: number, c: number) => void;
    readonly showcaserunner_setShakespeareText: (a: number, b: number, c: number) => number;
    readonly showcaserunner_setSqliteSource: (a: number, b: number, c: number) => number;
    readonly showcaserunner_setTime: (a: number, b: number) => void;
    readonly showcaserunner_step: (a: number) => number;
    readonly showcaserunner_takeFlatPatches: (a: number) => number;
    readonly showcaserunner_takeLogs: (a: number) => number;
    readonly wasm_start: () => void;
    readonly __wbindgen_export: (a: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export3: (a: number, b: number) => number;
    readonly __wbindgen_export4: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
