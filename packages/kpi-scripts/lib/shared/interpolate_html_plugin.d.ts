import type Webpack from 'webpack';
export default class InterpolateHtmlPlugin {
    private replacements;
    constructor(replacements: Record<string, any>);
    apply(compiler: Webpack.Compiler): void;
}
