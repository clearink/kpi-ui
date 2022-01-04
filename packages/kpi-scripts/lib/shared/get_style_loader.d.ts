interface GetStyleLoaderOptions {
    module: boolean;
    sass: boolean;
    useTailwind: boolean;
    mode: 'development' | 'production';
}
export default function getStyleLoader(options: GetStyleLoaderOptions): (string | false | {
    loader: string;
    options: {
        modules: boolean;
        importLoaders: number;
        postcssOptions?: undefined;
    };
} | {
    loader: string;
    options: {
        postcssOptions: {
            plugins: (string | false)[];
        };
        modules?: undefined;
        importLoaders?: undefined;
    };
})[];
export {};
