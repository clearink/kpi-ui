import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebPackBarPlugin from 'webpackbar';
declare const _default: {
    resolve: {
        extensions: readonly [".tsx", ".ts", ".js", ".jsx"];
        alias: {
            '@': string;
        };
    };
    cache: {
        type: string;
    };
    entry: string;
    module: {
        rules: ({
            test: RegExp;
            include: string;
            type: string;
            use?: undefined;
        } | {
            test: RegExp;
            include: string;
            use: (string | {
                loader: string;
                options: {
                    modules: boolean;
                    importLoaders: number;
                    postcssOptions?: undefined;
                    workerParallelJobs?: undefined;
                };
            } | {
                loader: string;
                options: {
                    postcssOptions: {
                        plugins: string[][];
                    };
                    modules?: undefined;
                    importLoaders?: undefined;
                    workerParallelJobs?: undefined;
                };
            } | {
                loader: string;
                options: {
                    workerParallelJobs: number;
                    modules?: undefined;
                    importLoaders?: undefined;
                    postcssOptions?: undefined;
                };
            })[];
            type?: undefined;
        })[];
    };
    plugins: (HtmlWebpackPlugin | WebPackBarPlugin)[];
    output: {
        pathinfo: boolean;
    };
};
export default _default;
