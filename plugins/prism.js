import 'clipboard'
import Prism from 'prismjs'

// Include a theme:
import 'prismjs/themes/prism-tomorrow.css'

// Inlude plugins
// Include the toolbar plugin: (optional)
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

// Include additional languages
import 'prismjs/components/prism-dart.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-css.js'

// Set vue SFC to markdown
Prism.languages.vue = Prism.languages.markup

export default Prism
