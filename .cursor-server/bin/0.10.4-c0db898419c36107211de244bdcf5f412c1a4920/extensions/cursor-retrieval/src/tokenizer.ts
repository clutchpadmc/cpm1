import * as vscode from 'vscode'
import * as WinkWrapper from 'wink-nlp'
import * as ModelWrapper from 'wink-eng-lite-web-model'

// @ts-ignore
const nlp = WinkWrapper(ModelWrapper) as WinkWrapper.WinkMethods;
const its = nlp.its

// We add custom stop words unique to code
const customStopWords = new Set([
	'code'
])

export class Tokenizer {
	tokenize(query: string) {



		const tokens = nlp.readDoc(query).tokens();
		const stopWords = tokens.out(its.stopWordFlag);
		const filteredTokens = tokens.filter(token =>
			!stopWords[token.index()] &&
			token.out().length > 2 &&
			// Check if the token string is alphanumeric
			!!(token.out().match(/^[a-z0-9]+$/i)) &&
			// Check if the token string is not a custom stop word
			!customStopWords.has(token.out())

		);
		const stems = tokens.out(its.stem);

		const outArr: vscode.Token[] = []
		filteredTokens.each(token => {
			outArr.push({
				text: token.out(),
				stem: stems[token.index()],
			})
		})

		return outArr
	}

}

// If this is main file, run the extension
if (require.main === module) {
	const tokenizer = new Tokenizer()
	const query = 'Where is the stripe code that handle payments?'
	const tokens = tokenizer.tokenize(query);
}