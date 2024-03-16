# Jelly UI

Jelly UI is a minimalistic but customizable component library designed to streamline frontend development. It offers a collection of reusable UI components that can be easily customized to fit various project needs. Whether you're building a simple landing page or a complex web application, @jellyio/ui provides the building blocks to create sleek and responsive user interfaces.

## Features

- **Minimalistic Design**: @jellyio/ui components are designed with simplicity and clarity in mind, offering a clean and modern aesthetic.
- **Customizable**: Each component is highly customizable, allowing you to easily adjust styles, themes, and functionality to match your project requirements.
- **Themes**: @jellyio/ui supports theming, making it effortless to apply different visual styles to your components. Choose from pre-defined themes or create your own custom themes.
- **Open Source**: @jellyio/ui is open source, meaning you have full access to the source code and can contribute to its development.

## Installation

You can install @jellyio/ui via npm:

```sh
npm install @jellyio/ui
yarn add @jellyio/ui
```

## Usage

To use Jelly UI in your project, simply import the desired component and integrate it in your code:

```tsx
import { Button } from '@jellyio/ui';

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

For detailed usage instructions and available components, refer to the documentation.

## Theming

Jelly UI comes with pre-defined themes that can be applied to components.

```tsx
import { Button } from '@jellyio/ui';

function App() {
  return (
    <div className="theme-blue">
      <Button variant="primary">Click me</Button>
    </div>
  );
}
```

## Contributing

Contributions to Jelly UI are welcome! If you find an issue or have a feature request, please [open an issue](https://github.com/salty-max/jelly/issues) or [create a pull request](https://github.com/salty-max/jelly/pulls) on GitHub.

## License

Jelly UI is licensed under the MIT license.
