# Rego syntax grammar

`rego.tmLanguage.json` is derived from the Rego TextMate grammar maintained by
the [Open Policy Agent VS Code extension](https://github.com/open-policy-agent/vscode-opa).

- Source: [syntaxes/Rego.tmLanguage](https://github.com/open-policy-agent/vscode-opa/blob/9291e7c81d3656b1005e5a323834d837a321f979/syntaxes/Rego.tmLanguage)
- Upstream commit: `9291e7c81d3656b1005e5a323834d837a321f979`
- Upstream grammar blob: `5fa99100e125d07d1d0964321c65b65c165fb043`
- License: Apache License 2.0, reproduced in `LICENSE.rego`.

Changes: converted the upstream XML plist to JSON with Python's `plistlib`,
normalized the registration name to `rego`, and added a display name, alias,
and this attribution notice for use with Shiki. All syntax rules are unchanged.
The grammar is used only during the Astro build; no extension code is included.
