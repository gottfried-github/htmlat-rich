# Description
## What it doesn't do
1. It will ignore any descendants, specified by the selector: `div#address-container>span#address` won't generate the span with it's attributes: it only will generate the div with it's attributes.
2. It will ignore the text content: `{text content}` (probably, it won't parse it)
3. It doesn't support `@emmetio/abbreviaton`'s selector grouping with braces (see (their readme)[https://github.com/emmetio/emmet/tree/master/packages/abbreviation]): the `semtext-pairs` syntax doesn't support nested braces - this `(a>(b>c+d)*4){{an/url}}` will break the parsing.
