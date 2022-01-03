export declare const CWD: string;
export declare function resolveApp(relativePath: string): string;
export declare const DEV_CONST: {
    APP_DIR: string;
    SRC_DIR: string;
    PUBLIC_DIR: string;
    OUTPUT_PATH: string;
    RESOLVE_EXTENSIONS: string[];
    PUBLIC_PATH: string;
    WEBPACK_CACHE_DIR: string;
    TS_CONFIG: string;
    JS_CONFIG: string;
    NODE_MODULES: string;
} & {
    FIND_ENTRY_FILE: () => string;
    CACHE_VERSION: any;
    PUBLIC_HTML_FILE: string;
    PUBLIC_FILES: string;
    FIND_CACHE_TSCONFIG: () => string[];
};
