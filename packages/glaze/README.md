<p align="center">
  <img alt="glaze" src="https://raw.githubusercontent.com/kripod/glaze/master/assets/logo.svg?sanitize=true" width="317">
</p>

<p align="center">
  CSS-in-JS microlibrary for making design systems approachable with React
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/glaze"><img alt="npm" src="https://img.shields.io/npm/v/glaze"></a>
  <a href="https://lgtm.com/projects/g/kripod/glaze/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/kripod/glaze.svg?logo=lgtm&logoWidth=18"/></a>
  <a href="https://travis-ci.com/github/kripod/glaze"><img alt="Travis (.com)" src="https://img.shields.io/travis/com/kripod/glaze"></a>
  <a href="https://opencollective.com/glaze"><img alt="Open Collective backers and sponsors" src="https://img.shields.io/opencollective/all/glaze"></a>
</p>

## 💡 Motivation

This project was born to combine the best of its predecessors into a single solution:

- **Utility-first CSS,** as implemented by [Tailwind CSS][]
  - Fully static, but customizable upfront
  - Embraces reusability with no duplicated rules
- **Constraint-based layouts,** popularized by [Theme UI][]
  - Highly dynamic, thankfully to [Emotion][]
  - One-off styles can be defined naturally
- **Near-zero runtime,** made possible by [treat][]
  - Theming support with legacy browsers in mind
  - Static style extraction while retaining type safety

[tailwind css]: https://tailwindcss.com/
[stylesheet]: https://github.com/giuseppeg/style-sheet
[css-zero]: https://github.com/CraigCav/css-zero
[theme ui]: https://theme-ui.com/
[emotion]: https://emotion.sh/
[treat]: https://seek-oss.github.io/treat/

## 📚 Usage

0. Install the package and its peer dependencies:

   ```sh
   npm install glaze treat
   ```

1. Define a theme, preferably by overriding the [default tokens](https://github.com/kripod/glaze/blob/master/packages/glaze/src/presets/defaultTokens.ts):

   ```js
   /* theme.treat.js */

   import { createTheme, defaultTokens } from 'glaze';

   export default createTheme({
     ...defaultTokens,

     // Customization
     scales: {
       ...defaultTokens.scales,
       color: {
         red: '#f8485e',
       },
     },
   });
   ```

   _Keeping the runtime as small as possible, only a few tokens (`breakpoints`, `shorthands` and `aliases`) are embedded into production JavaScript bundles. Other values can only be accessed exclusively for styling, as shown later._

2. Apply the theme through `ThemeProvider`:

   > 📝 The [Gatsby plugin for glaze](https://www.npmjs.com/package/gatsby-plugin-glaze) does this unobtrusively.

   ```jsx
   import { ThemeProvider } from 'glaze';
   import theme from './theme.treat';

   export default function Layout({ children }) {
     return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
   }
   ```

3. Style elements with the `sx` function:

   ```jsx
   import { useStyling } from 'glaze';

   export default function Component() {
     const sx = useStyling();

     return (
       <p
         className={sx({
           px: 4, // Sets padding-left and padding-right to 1rem
           color: 'white',
           bg: 'red', // Sets background to #f8485e
         })}
       >
         Hello, world!
       </p>
     );
   }
   ```

4. Set up [static style extraction](https://seek-oss.github.io/treat/setup/) with the help of [treat][].

   > 📝 The [Gatsby plugin for treat](https://www.npmjs.com/package/gatsby-plugin-treat) does this unobtrusively.

   - Afterwards, selector-based CSS rules may be created with [`globalStyle`](https://seek-oss.github.io/treat/styling-api/#globalstyle) in `*.treat.js` files. They have to be applied as a side effect, e.g. from a top-level layout component:

     ```js
     import './globalStyles.treat.js';
     ```

5. Configure [server-side rendering](./docs/server-side-rendering.md) for dynamically created styles.

## 🤔 How it works

- The `sx` function maps themed values to statically generated class names
  - If that fails, the style gets injected dynamically through the CSSOM
- Dynamic styles which are not in use by any component get removed

### Rule handling

1. Transform each alias to its corresponding CSS property name or custom shorthand
2. Resolve values from the scales available
   - CSS properties associated with a custom shorthand are resolved one by one

### Example

Given the theme below:

```js
import { createTheme } from 'glaze';

export default createTheme({
  scales: {
    spacing: { 4: '1rem' },
  },
  shorthands: {
    paddingX: ['paddingLeft', 'paddingRight'],
  },
  aliases: {
    px: 'paddingX',
  },
  matchers: {
    paddingLeft: 'spacing',
    paddingRight: 'spacing',
  },
});
```

An `sx` parameter is matched to CSS rules as follows:

1. `{ px: 4 }`
2. `{ paddingX: 4 }`, after transforming aliases
3. `{ paddingLeft: 4, paddingRight: 4 }`, after unfolding custom shorthands
4. `{ paddingLeft: '1rem', paddingRight: '1rem' }`, after applying matchers

## ✨ Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/kripod"><img src="https://avatars3.githubusercontent.com/u/14854048?v=4" width="100px;" alt=""/><br /><sub><b>Kristóf Poduszló</b></sub></a><br /><a href="#maintenance-kripod" title="Maintenance">🚧</a> <a href="https://github.com/kripod/glaze/commits?author=kripod" title="Code">💻</a> <a href="https://github.com/kripod/glaze/commits?author=kripod" title="Documentation">📖</a> <a href="#example-kripod" title="Examples">💡</a> <a href="#ideas-kripod" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-kripod" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://jes.st/about"><img src="https://avatars1.githubusercontent.com/u/612020?v=4" width="100px;" alt=""/><br /><sub><b>Jess Telford</b></sub></a><br /><a href="https://github.com/kripod/glaze/commits?author=jesstelford" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/tatchi"><img src="https://avatars2.githubusercontent.com/u/5595092?v=4" width="100px;" alt=""/><br /><sub><b>Corentin Leruth</b></sub></a><br /><a href="https://github.com/kripod/glaze/commits?author=tatchi" title="Documentation">📖</a> <a href="https://github.com/kripod/glaze/commits?author=tatchi" title="Code">💻</a> <a href="https://github.com/kripod/glaze/commits?author=tatchi" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://hennessyevan.com"><img src="https://avatars1.githubusercontent.com/u/16711653?v=4" width="100px;" alt=""/><br /><sub><b>Evan Hennessy</b></sub></a><br /><a href="https://github.com/kripod/glaze/commits?author=hennessyevan" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Acknowledgements

Without its predecessors, glaze wouldn't exist. Thanks for all the wonderful people who have contributed towards the project, even indirectly.

The logo's donut emoji is courtesy of [Twemoji](https://twemoji.twitter.com/).
