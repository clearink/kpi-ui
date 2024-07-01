import glob from "fast-glob";
import fse from "fs-extra";
import path from "path";
import slash from "slash";
import tsm from "ts-morph";

import {
	constants,
	formatExternals,
	getPkgJson,
	specifierMatches,
} from "../../utils/helpers";

export default async function buildDts() {
	const project = new tsm.Project({
		skipAddingFilesFromTsConfig: true,
		compilerOptions: {
			allowJs: true,
			declaration: true,
			emitDeclarationOnly: true,
			declarationDir: constants.esm,
		},
	});

	const root = constants.resolveCwd("src");

	const pkgJson = await getPkgJson();

	const externals = formatExternals(pkgJson);

	const sourceFiles = glob
		.sync("**/*.ts{,x}", { cwd: root })
		.map((file) => project.addSourceFileAtPath(path.resolve(root, file)));

	const resolve = (filepath: string, text: string) => {
		const isExternal = externals.find((e) => specifierMatches(e, text));

		if (isExternal) return;

		const matched = constants.alias.find((e) => specifierMatches(e.find, text));

		if (!matched) return;

		let rel = path.relative(path.dirname(filepath), matched.replacement);

		if (!rel.startsWith(".")) rel = `./${rel}`;

		const re = new RegExp(`^${matched.find}`);

		return slash(text.replace(re, rel));
	};

	sourceFiles.forEach((sourceFile) => {
		const filepath = sourceFile.getFilePath();

		sourceFile.getImportDeclarations().forEach((node) => {
			const text = node.getModuleSpecifierValue();

			const newText = resolve(filepath, text);

			if (newText) node.setModuleSpecifier(newText);
		});

		sourceFile.getExportDeclarations().forEach((node) => {
			const text = node.getModuleSpecifierValue();

			if (!text) return;

			const newText = resolve(filepath, text);

			if (newText) node.setModuleSpecifier(newText);
		});
	});

	await project.emit({ emitOnlyDtsFiles: true });

	// copy dts files to lib
	await Promise.all(
		glob.sync("**/*.d.ts", { cwd: constants.esm }).map((file) => {
			const filepath = path.resolve(constants.esm, file);
			return fse.copy(filepath, constants.resolveCjs(file));
		}),
	);
}
