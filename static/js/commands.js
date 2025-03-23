$(document).ready(() => {
    function extractCommand(prompt, str, state) {
        let continued = state.continuation;
        state.continuation = str.endsWith('\\');

        if (continued)
            return str;
        if (str.startsWith(prompt))
            return str.slice(prompt.length);
    }

    $('.highlight > pre > code.language-console').each(function() {
	let state = { continuation: false };
        let commands = this.textContent.split('\n')
            .map(line => extractCommand('$ ', line, state))
            .filter(cmd => !!cmd)
            .join('\n');
        if (commands.length > 0) {
            let copy = $('<div class="copy-command">Copy</div>');
            copy.click(() => navigator.clipboard.writeText(commands));

            let highlight = $(this).parent().parent();
            highlight.css('position', 'relative');
            highlight.prepend(copy);
        }
    });
});
