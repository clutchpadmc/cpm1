import { get_encoding, Tiktoken } from '@dqbd/tiktoken';
import { BPETokenInfo, UsableTokenizer } from 'vscode';

export const CLK_TOKENIZER = get_encoding('cl100k_base');
export const P50_TOKENIZER = get_encoding('p50k_base');
export const GPT2_TOKENIZER = get_encoding('gpt2');

export function getTokenizerFromName(tokenizer: UsableTokenizer): Tiktoken {
	switch (tokenizer) {
		case 'gpt2':
			return GPT2_TOKENIZER;
		case 'p50k_base':
			return P50_TOKENIZER;
		case 'cl100k_base':
			return CLK_TOKENIZER;
		case 'r50k_base':
			throw new Error('r50k_base not supported');
	}
}


export class Tokenizer {

	tokenize(text: string, model: UsableTokenizer): BPETokenInfo[] {
		const tokenizer = getTokenizerFromName(model);
		const tokens = tokenizer.encode(text);
		const newArr = [];
		for (const token of tokens) {
			// Convert the number[] to a Uint32Array
			const tokenArray = new Uint32Array([token]);
			newArr.push({
				text: new TextDecoder().decode(tokenizer.decode(tokenArray)),
				token: token
			})
		}

		return newArr;
	}
}

// If this is main file, run the extension
if (require.main === module) {
	const tokenizer = new Tokenizer()
	const query = 'Where is the stripe code that handle payments?'
	const tokens = tokenizer.tokenize(query, 'gpt2')
	console.log(tokens)
}