import type {
    PluginBuilder,
    OnLoadResult,
    OnLoadArgs,
    BunPlugin
} from 'bun';

import { transform } from 'typia/lib/transform';
import { resolve } from 'node:path';
import ts from 'typescript';

type TypiaResult = Record<string, string>;

const pluginName = 'bun-plugin-typia';

const getTestFiles = () => {

    const testFilePatterns = '{.test.{js,jsx,ts,tsx},_test.{js,jsx,ts,tsx},.spec.{js,jsx,ts,tsx},_spec.{js,jsx,ts,tsx}}';
    const files = [];

    for (const file of new Bun.Glob(
        `**/*${testFilePatterns}`
    ).scanSync({
        absolute: true,
        onlyFiles: true
    })) {

        if (!file.includes('node_modules')) {
            files.push(file);
        }

    }

    return files;
};

const typiaPlugin = (options?: {
    verbose?: true;
    disableLoader?: true;
}): {
    results: TypiaResult;
    onLoadCallback: typeof onLoadCallback;
} & BunPlugin => {

    const results: TypiaResult = {};

    const onLoadCallback: (
        build: PluginBuilder,
        args: OnLoadArgs,
    ) => Promise<OnLoadResult> | OnLoadResult = async (_, { path }) => ({
        contents: results[path] ?? await Bun.file(path).text()
    });

    return {
        name: pluginName,
        setup(build) {
            if (options?.verbose) {
                console.log(`${pluginName}: Generating...`);
            }

            const { options: compilerOptions } = ts.parseJsonConfigFileContent(
                ts.readConfigFile(`${process.cwd()}/tsconfig.json`, ts.sys.readFile.bind(ts.sys))
                    .config,
                {
                    fileExists: ts.sys.fileExists.bind(ts.sys),
                    readFile: ts.sys.readFile.bind(ts.sys),
                    readDirectory: ts.sys.readDirectory.bind(ts.sys),
                    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
                },
                process.cwd()
            );

            const files =
                process.env.NODE_ENV === 'test'
                    ? getTestFiles()
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    : build.config?.entrypoints.length
                        ? build.config.entrypoints.map((entrypoint) => resolve(entrypoint))
                        : [Bun.main];

            const program: ts.Program = ts.createProgram(files, compilerOptions);

            const result: ts.TransformationResult<ts.SourceFile> = ts.transform(

                program.getSourceFiles().filter((file) => !file.isDeclarationFile &&
                    resolve(file.fileName).includes(process.cwd())),
                [
                    transform(
                        program,
                        ((compilerOptions.plugins as undefined | any[]) ?? []).find(
                            (p: { transform?: string }) => p.transform === 'typia/lib/transform'
                        ) ?? {},
                        {
                            addDiagnostic: () => 0
                        }
                    )
                ],
                program.getCompilerOptions()
            );

            const printer: ts.Printer = ts.createPrinter({
                newLine: ts.NewLineKind.LineFeed
            });

            for (const file of result.transformed) {
                const content: string = printer.printFile(file);
                results[resolve(file.fileName)] = content;
            }

            if (!options?.disableLoader) {
                build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => onLoadCallback(build, args));
            }

            if (options?.verbose) {
                Object.keys(results).forEach((filePath) => {
                    console.log(`${pluginName}: ${filePath}`);
                });
                console.log(`${pluginName}: Done`);
            }
        },
        onLoadCallback,
        results
    };
};

await Bun.plugin(typiaPlugin());
