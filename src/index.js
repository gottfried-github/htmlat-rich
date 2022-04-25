import nearley from 'nearley'
import grammar from 'semtext-pairs_proto.2/src/grammar.js'
import emmet from 'emmet'

const TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'span', 'br', 'a',
    'section', 'ul', 'ol', 'li',
    'div',
    'img'
]

function firstOccuringText(node) {
    return node.find(node => 'text' === node.type)?.text
}

function renderBottomUp(node, document, options) {
    // node either has a label, in which case it is an entity, or it is a text (see Processed data)
    if (!node.label) {
        if (!options.spanTextNodes) return document.createTextNode(node.text)

        const dom = document.createElement('span')
        dom.setAttribute('data-semtext-text', true)
        dom.innerHTML = node.text

        return dom
    }

    if ('c' === node.label.value) return null
    const nodeData = emmet.parseMarkup(node.label.value, emmet.resolveConfig()).children[0]

    // console.log("renderBottomUp, nodeData", nodeData)

    if (!TAGS.includes(nodeData.name)) throw new Error(`the tagname '${nodeData.name}' isn't supported`)

    const dom = document.createElement(nodeData.name)
    if (nodeData.attributes) nodeData.attributes.forEach(attr => dom.setAttribute(attr.name, attr.value))

    if ('img' === nodeData.name) {
        const firstText = firstOccuringText(node.node)
        if (firstText) dom.setAttribute('alt', firstText)

        return dom
    }

    node.node.forEach(node => {
        const child = renderBottomUp(node, document, options)
        if (child) dom.appendChild(child)
    })

    return dom
}

function spanToTextTextNodes(dom, document) {
    dom.querySelectorAll('[data-semtext-text]').forEach(el => {
        el.replaceWith(document.createTextNode(el.innerHTML))
    })

    return dom
}

function convert(text, document, options) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(text)

    return renderBottomUp(parser.results[0], document, options || {})
}

export {convert, spanToTextTextNodes, TAGS}
