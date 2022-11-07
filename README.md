Automatic Editor Sorter
=======================

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zokugun.automatic-editor-sorter?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=zokugun.automatic-editor-sorter)
[![Open VSX Version](https://img.shields.io/open-vsx/v/zokugun/automatic-editor-sorter?label=Open%20VSX)](https://open-vsx.org/extension/zokugun/automatic-editor-sorter)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

With [Automatic Editor Sorter](https://github.com/zokugun/vscode-automatic-editor-sorter), your opened editors are automatically sorted by their names or paths.

## Configuration

### `automaticEditorSorter.enabled`

```json
{
    // controls whether open editors are sorted or not, optional (set to `true` by default)
    "automaticEditorSorter.enabled": true,
}
```

| value   | description                      |
| ------- | -------------------------------- |
| `false` | disable the extension            |
| `true`  | enable the extension, by default |

### `automaticEditorSorter.order`

```json
{
    // controls in which direction the open editors are sorted, optional (set to `asc` by default)
    "automaticEditorSorter.order": "asc",
}
```

| value  | description                             |
| ------ | --------------------------------------- |
| `asc`  | the open editors are sorted from A to Z |
| `desc` | the open editors are sorted from Z to A |

### `automaticEditorSorter.rule`

```json
{
    // controls how the open editors are sorted, optional (set to `name` by default)
    "automaticEditorSorter.rule": "name",
}
```

| value           | description                                                                        |
| --------------- | ---------------------------------------------------------------------------------- |
| `absolute`      | the open editors are sorted by their absolute path                                 |
| `name`          | the open editors are sorted by their name then, by their parent's name, by default |
| `name,absolute` | the open editors are sorted by their name then, by their absolute path             |

## FAQ

**Q:** Why are preview editors not sorted?

**A:** The extension doesn't do it since moving a preview editor will cause it to be fully opened.

**Q:** Are the pinned editors supported?

**A:** Yes, even when you are pinning a preview editor. It will cause it to be fully opened and then to be pinned.

## Donations

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

**Enjoy!**
