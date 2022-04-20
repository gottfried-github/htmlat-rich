import nearley from 'nearley'
import grammar from 'semtext-pairs_proto.2/src/grammar.js'
import emmet from 'emmet'

const TAGS = ['div', 'section', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'p', 'img', 'a']

function firstOccuringText(node) {
    return node.find(node => 'text' === node.type)?.text
}

function renderBottomUp(node, document) {
    // node either has a label, in which case it is an entity, or it is a text (see Processed data)
    if (!node.label) return document.createTextNode(node.text)

    if ('c' === node.label.value) return null
    const nodeData = emmet.parseMarkup(node.label.value, emmet.resolveConfig()).children[0]

    console.log("renderBottomUp, nodeData", nodeData)


    if (!TAGS.includes(nodeData.name)) throw new Error(`the tagname '${nodeData.name}' isn't supported`)

    const dom = document.createElement(nodeData.name)
    if (nodeData.attributes) nodeData.attributes.forEach(attr => dom.setAttribute(attr.name, attr.value))

    if ('img' === nodeData.name) {
        const firstText = firstOccuringText(node.node)
        if (firstText) dom.setAttribute('alt', firstText)

        return dom
    }

    node.node.forEach(node => {
        const child = renderBottomUp(node, document)
        if (child) dom.appendChild(child)
    })

    return dom
}

function convert(text, document) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(text)

    return renderBottomUp(parser.results[0], document)
}

export {convert}