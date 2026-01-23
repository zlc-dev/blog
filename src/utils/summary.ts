import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';

type MDXSummaryOptions = {
    maxLength?: number;      // 最大字符数
    paragraphLimit?: number; // 最多取几个段落
    includeCode?: boolean;   // 是否包含代码块
};

export function getMDXSummary(
    mdxSource: string,
    options: MDXSummaryOptions = {},
    ellipsis: boolean = true
): string {
    const {
        maxLength = 300,
        paragraphLimit = 3,
        includeCode = false,
    } = options;

    const ast = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkMdx)
        .parse(mdxSource);

    const blocks: string[] = [];

    const ctx = walk(ast, 
        {
            maxLength,
            paragraphLimit,
            includeCode,
        }, 
        blocks
    );

    if (ctx.done && ellipsis) {
        blocks.push('...');
    }

    const result = blocks
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    return result;
}

type WalkContext = {
    readonly length: number;
    readonly paragraphs: number;
    readonly list_level: number;
    readonly done: boolean;
};

type MutableWalkContext = {
    -readonly [K in keyof WalkContext]: WalkContext[K];
};

type NonNullable<T> = T extends null | undefined ? never : T;

type AllNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

function isParagraphLike(node: any, includeCode: boolean) {
    if (node.type === 'code') return includeCode;
    return (
        node.type === 'paragraph' ||
        node.type === 'heading' && node.depth < 2 ||
        node.type === 'blockquote'
    );
}

function shouldStop(ctx: WalkContext, options: AllNonNullable<MDXSummaryOptions>) {
    return (
        ctx.length >= options.maxLength ||
        ctx.paragraphs >= options.paragraphLimit
    );
}

function walk(
    node: any,
    options: AllNonNullable<MDXSummaryOptions>,
    blocks: string[],
    input_ctx: WalkContext = { length: 0, paragraphs: 0, list_level: 0, done: false },
): WalkContext {
    if (!node || input_ctx.done) return input_ctx;
    let ctx: MutableWalkContext = { ...input_ctx };

    if (shouldStop(ctx, options)) {
        ctx.done = true;
        return ctx;
    }

    switch (node.type) {
        case 'mdxjsEsm':
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
        case 'mdxJsxFlowExpression':
        case 'mdxJsxTextExpression':
            return ctx;
    }

    if (
        isParagraphLike(node, options.includeCode) &&
        ctx.list_level === 0
    ) {
        ctx.paragraphs += 1;
        if (shouldStop(ctx, options)) {
            ctx.done = true;
            return ctx;
        }
    }

    if (node.type === 'code') {
        if (!options.includeCode) {
            return ctx;
        }
    }

    if (node.type === 'list') {
        ctx.list_level++;
        for (const child of node.children ?? []) {
            ctx = walk(child, options, blocks, ctx);
            if (ctx.done) break;
        }
        ctx.list_level--;
        return ctx;
    }

    if (typeof node.value === 'string') {
        const remain = options.maxLength - ctx.length;
        if (remain <= 0) {
            ctx.done = true;
            return ctx;
        }

        const text = node.value.slice(0, remain);
        blocks.push(text);
        ctx.length += text.length;

        if (shouldStop(ctx, options)) {
            ctx.done = true;
            return ctx;
        }
    }

    for (const child of node.children ?? []) {
        ctx = walk(child, options, blocks, ctx);
        if (ctx.done) break;
    }

    return ctx;
}
