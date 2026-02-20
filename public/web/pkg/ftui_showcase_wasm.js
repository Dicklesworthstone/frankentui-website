/* @ts-self-types="./ftui_showcase_wasm.d.ts" */

/**
 * WASM showcase runner for the FrankenTUI demo application.
 *
 * Host-driven: JavaScript controls the event loop via `requestAnimationFrame`,
 * pushing input events and advancing time each frame.
 */
export class ShowcaseRunner {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShowcaseRunnerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_showcaserunner_free(ptr, 0);
    }
    /**
     * Advance deterministic clock by `dt_ms` milliseconds (real-time mode).
     * @param {number} dt_ms
     */
    advanceTime(dt_ms) {
        wasm.showcaserunner_advanceTime(this.__wbg_ptr, dt_ms);
    }
    /**
     * Release internal resources.
     */
    destroy() {
        wasm.showcaserunner_destroy(this.__wbg_ptr);
    }
    /**
     * Length (in `u32` words) of the prepared flat cell payload.
     * @returns {number}
     */
    flatCellsLen() {
        const ret = wasm.showcaserunner_flatCellsLen(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Byte-offset pointer to the prepared flat cell payload (`u32` words).
     * @returns {number}
     */
    flatCellsPtr() {
        const ret = wasm.showcaserunner_flatCellsPtr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Length (in `u32` words) of the prepared flat span payload.
     * @returns {number}
     */
    flatSpansLen() {
        const ret = wasm.showcaserunner_flatSpansLen(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Byte-offset pointer to the prepared flat span payload (`u32` words).
     * @returns {number}
     */
    flatSpansPtr() {
        const ret = wasm.showcaserunner_flatSpansPtr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Current frame index (monotonic, 0-based).
     * @returns {bigint}
     */
    frameIdx() {
        const ret = wasm.showcaserunner_frameIdx(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Initialize the model and render the first frame. Call exactly once.
     */
    init() {
        wasm.showcaserunner_init(this.__wbg_ptr);
    }
    /**
     * Whether the program is still running.
     * @returns {boolean}
     */
    isRunning() {
        const ret = wasm.showcaserunner_isRunning(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Create a new runner with initial terminal dimensions (cols, rows).
     * @param {number} cols
     * @param {number} rows
     */
    constructor(cols, rows) {
        const ret = wasm.showcaserunner_new(cols, rows);
        this.__wbg_ptr = ret >>> 0;
        ShowcaseRunnerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Active pane pointer id tracked by the adapter, or `null`.
     * @returns {number | undefined}
     */
    paneActivePointerId() {
        const ret = wasm.showcaserunner_paneActivePointerId(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Apply one adaptive pane layout intelligence mode.
     *
     * `mode`: `0=focus`, `1=compare`, `2=monitor`, `3=compact`.
     * `primary_pane_id`: pass `0` to use current selection anchor.
     * @param {number} mode
     * @param {bigint} primary_pane_id
     * @returns {boolean}
     */
    paneApplyLayoutMode(mode, primary_pane_id) {
        const ret = wasm.showcaserunner_paneApplyLayoutMode(this.__wbg_ptr, mode, primary_pane_id);
        return ret !== 0;
    }
    /**
     * Pane-specific blur path.
     * @returns {any}
     */
    paneBlur() {
        const ret = wasm.showcaserunner_paneBlur(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Export current pane workspace snapshot JSON.
     * @returns {string | undefined}
     */
    paneExportWorkspaceSnapshot() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.showcaserunner_paneExportWorkspaceSnapshot(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export2(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Import pane workspace snapshot JSON.
     * @param {string} json
     * @returns {boolean}
     */
    paneImportWorkspaceSnapshot(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.showcaserunner_paneImportWorkspaceSnapshot(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Live pane layout state (ghost preview + timeline + selection).
     * @returns {any}
     */
    paneLayoutState() {
        const ret = wasm.showcaserunner_paneLayoutState(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Pane-specific lost pointer capture path.
     * @param {number} pointer_id
     * @returns {any}
     */
    paneLostPointerCapture(pointer_id) {
        const ret = wasm.showcaserunner_paneLostPointerCapture(this.__wbg_ptr, pointer_id);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer-cancel path.
     *
     * Pass `0` to represent an unspecified pointer id.
     * @param {number} pointer_id
     * @returns {any}
     */
    panePointerCancel(pointer_id) {
        const ret = wasm.showcaserunner_panePointerCancel(this.__wbg_ptr, pointer_id);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer capture acknowledgement path.
     * @param {number} pointer_id
     * @returns {any}
     */
    panePointerCaptureAcquired(pointer_id) {
        const ret = wasm.showcaserunner_panePointerCaptureAcquired(this.__wbg_ptr, pointer_id);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer-down path with direct capture semantics.
     *
     * `axis`: `0` = horizontal, `1` = vertical.
     * `button`: DOM semantics (`0` = primary, `1` = middle, `2` = secondary).
     * `mods` bitmask: `1=shift`, `2=alt`, `4=ctrl`, `8=meta`.
     * @param {bigint} split_id
     * @param {number} axis
     * @param {number} pointer_id
     * @param {number} button
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerDown(split_id, axis, pointer_id, button, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerDown(this.__wbg_ptr, split_id, axis, pointer_id, button, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Pane pointer-down path that auto-detects pane/edge/corner from coordinates.
     * @param {number} pointer_id
     * @param {number} button
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerDownAt(pointer_id, button, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerDownAt(this.__wbg_ptr, pointer_id, button, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer-leave path.
     * @param {number} pointer_id
     * @returns {any}
     */
    panePointerLeave(pointer_id) {
        const ret = wasm.showcaserunner_panePointerLeave(this.__wbg_ptr, pointer_id);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer-move path.
     * @param {number} pointer_id
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerMove(pointer_id, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerMove(this.__wbg_ptr, pointer_id, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Auto-targeted pointer move path.
     * @param {number} pointer_id
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerMoveAt(pointer_id, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerMoveAt(this.__wbg_ptr, pointer_id, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Pane-specific pointer-up path.
     *
     * `button`: DOM semantics (`0` = primary, `1` = middle, `2` = secondary).
     * `mods` bitmask: `1=shift`, `2=alt`, `4=ctrl`, `8=meta`.
     * @param {number} pointer_id
     * @param {number} button
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerUp(pointer_id, button, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerUp(this.__wbg_ptr, pointer_id, button, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Auto-targeted pointer-up path.
     * @param {number} pointer_id
     * @param {number} button
     * @param {number} x
     * @param {number} y
     * @param {number} mods
     * @returns {any}
     */
    panePointerUpAt(pointer_id, button, x, y, mods) {
        const ret = wasm.showcaserunner_panePointerUpAt(this.__wbg_ptr, pointer_id, button, x, y, mods);
        return takeObject(ret);
    }
    /**
     * Redo one pane structural change.
     * @returns {boolean}
     */
    paneRedoLayout() {
        const ret = wasm.showcaserunner_paneRedoLayout(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Rebuild pane tree from timeline baseline and cursor.
     * @returns {boolean}
     */
    paneReplayLayout() {
        const ret = wasm.showcaserunner_paneReplayLayout(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Undo one pane structural change.
     * @returns {boolean}
     */
    paneUndoLayout() {
        const ret = wasm.showcaserunner_paneUndoLayout(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Pane-specific hidden visibility path.
     * @returns {any}
     */
    paneVisibilityHidden() {
        const ret = wasm.showcaserunner_paneVisibilityHidden(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * FNV-1a hash of the last patch batch, or `null`.
     * @returns {string | undefined}
     */
    patchHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.showcaserunner_patchHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export2(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Patch upload stats: `{ dirty_cells, patch_count, bytes_uploaded }`, or `null`.
     * @returns {any}
     */
    patchStats() {
        const ret = wasm.showcaserunner_patchStats(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Prepare flat patch buffers in reusable Rust-owned storage.
     *
     * Pair this with `flatCellsPtr/flatCellsLen/flatSpansPtr/flatSpansLen`
     * for a zero-copy JS view over WASM memory.
     */
    prepareFlatPatches() {
        wasm.showcaserunner_prepareFlatPatches(this.__wbg_ptr);
    }
    /**
     * Parse a JSON-encoded input and push to the event queue.
     * Returns `true` if accepted, `false` if unsupported/malformed.
     * @param {string} json
     * @returns {boolean}
     */
    pushEncodedInput(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.showcaserunner_pushEncodedInput(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Resize the terminal (pushes Resize event, processed on next step).
     * @param {number} cols
     * @param {number} rows
     */
    resize(cols, rows) {
        wasm.showcaserunner_resize(this.__wbg_ptr, cols, rows);
    }
    /**
     * Provide the Shakespeare text blob for the `Shakespeare` screen.
     *
     * For WASM builds we avoid embedding multi-megabyte strings in the module.
     * The host should call this once during startup (or early in the session).
     * @param {string} text
     * @returns {boolean}
     */
    setShakespeareText(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.showcaserunner_setShakespeareText(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Provide the SQLite amalgamation source for the `CodeExplorer` screen.
     *
     * For WASM builds we avoid embedding multi-megabyte strings in the module.
     * The host should call this once during startup (or early in the session).
     * @param {string} text
     * @returns {boolean}
     */
    setSqliteSource(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.showcaserunner_setSqliteSource(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Set deterministic clock to absolute nanoseconds (replay mode).
     * @param {number} ts_ns
     */
    setTime(ts_ns) {
        wasm.showcaserunner_setTime(this.__wbg_ptr, ts_ns);
    }
    /**
     * Process pending events and render if dirty.
     * Returns `{ running, rendered, events_processed, frame_idx }`.
     * @returns {any}
     */
    step() {
        const ret = wasm.showcaserunner_step(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Take flat patch batch for GPU upload.
     * Returns `{ cells: Uint32Array, spans: Uint32Array }`.
     *
     * Uses reusable internal buffers to avoid per-frame Vec allocation.
     * @returns {any}
     */
    takeFlatPatches() {
        const ret = wasm.showcaserunner_takeFlatPatches(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Drain accumulated log lines. Returns `Array<string>`.
     * @returns {Array<any>}
     */
    takeLogs() {
        const ret = wasm.showcaserunner_takeLogs(this.__wbg_ptr);
        return takeObject(ret);
    }
}
if (Symbol.dispose) ShowcaseRunner.prototype[Symbol.dispose] = ShowcaseRunner.prototype.free;

export function wasm_start() {
    wasm.wasm_start();
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_function_0095a73b8b156f76: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_389efe28435a9388: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_call_4708e0c13bdc8e95: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_getRandomValues_1c61fac11405ffdc: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_getRandomValues_2a91986308c74a93: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_get_b3ed3ad4be2bc8ac: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_new_361308b2356cecd0: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_new_3eb36ae241fe6f44: function() {
            const ret = new Array();
            return addHeapObject(ret);
        },
        __wbg_new_from_slice_19d21922ff3c0ae6: function(arg0, arg1) {
            const ret = new Uint32Array(getArrayU32FromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_now_2c95c9de01293173: function(arg0) {
            const ret = getObject(arg0).now();
            return ret;
        },
        __wbg_now_a3af9a2f4bbaa4d1: function() {
            const ret = Date.now();
            return ret;
        },
        __wbg_performance_7a3ffd0b17f663ad: function(arg0) {
            const ret = getObject(arg0).performance;
            return addHeapObject(ret);
        },
        __wbg_push_8ffdcb2063340ba5: function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        },
        __wbg_set_6cb8631f80447a67: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments); },
        __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./ftui_showcase_wasm_bg.js": import0,
    };
}

const ShowcaseRunnerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_showcaserunner_free(ptr >>> 0, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('ftui_showcase_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
