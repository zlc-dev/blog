import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';

type MDXSummaryOptions = {
    maxLength?: number;      // 最大字符数
    paragraphLimit?: number; // 最多取几个段落
    includeCode?: boolean;   // 是否包含代码块
};

export function getMDXSummary(
    mdxSource: string,
    options: MDXSummaryOptions = {}
): string {
    const {
        maxLength = 300,
        paragraphLimit = 5,
        includeCode = false,
    } = options;

    const ast = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .parse(mdxSource);

    const blocks: string[] = [];

    walk(ast, 
        {
            maxLength,
            paragraphLimit,
            includeCode,
        }, 
        blocks
    );

    const result = blocks
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    return result.slice(0, maxLength);
}

type WalkContext = {
    length: number;
    paragraphs: number;
    list_level: number
}

type NonNullable<T> = T extends null | undefined ? never : T;

type AllNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type NonNullableMdxSummaryOptions = AllNonNullable<MDXSummaryOptions>;

function walk(
    node: any, 
    options: NonNullableMdxSummaryOptions,
    blocks: string[],
    current: WalkContext = {length: 0, paragraphs: 0, list_level: 0},
) {
    if (current.length > options.maxLength || current.paragraphs > options.paragraphLimit) {
        return current;
    }

    switch(node.type) {
        case 'mdxjsEsm':
            break;
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
        case 'mdxJsxFlowEexpression':
        case 'mdxJsxTextEexpression':
            break;

        case 'list':
            current.list_level++;
            if (node.children) {
                for(const child of node.children) {
                    current = walk(child, options, blocks, current);
                }
            }
            current.list_level--;
            if (current.list_level == 0) {
                current.paragraphs += 1;
            }
            break;

        case 'code':
            if (!options.includeCode) break;
            current.paragraphs += 1;
        case 'paragraph':
            if (current.list_level == 0) current.paragraphs += 1;
        default:
            if (node.value) {
                blocks.push(node.value);
                current.length += node.value.length;
            }
            if (node.children) {
                for(const child of node.children) {
                    current = walk(child, options, blocks, current);
                }
            }
            break;
    }
    return current;
}
