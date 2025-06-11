# Docker Compose File Support - VS Code Extension

![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/KilianJPopp.docker-compose-file-support)
![VS Code Installs](https://img.shields.io/visual-studio-marketplace/i/KilianJPopp.docker-compose-file-support)
![License](https://img.shields.io/github/license/Kilianjpo/docker-compose-file-support)

Enhanced support for Docker Compose files in VS Code with syntax highlighting, formatting, and validation.

## Features

### Syntax Highlighting
- Special highlighting for Docker Compose specific keywords
- Different colors for services, volumes, networks sections
- Highlighting for common service properties

### Smart Formatting
- Automatically organizes your docker-compose file structure
- Sorts services alphabetically
- Standardizes indentation (2 spaces)
- Reorders properties logically (image before build, etc.)

### Validation
- Validates YAML syntax
- Warns about common mistakes

## Installation

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for "Docker Compose Support"
4. Click Install

Alternatively, install from VS Code Marketplace:  
[Install Docker Compose Support](https://marketplace.visualstudio.com/items?itemName=KilianJPopp.docker-compose-file-support)

## Usage

### Formatting
To format a Docker Compose file:
1. Open your `docker-compose.yml` file
2. Use the command palette (`Ctrl+Shift+P`)
3. Run "Format Document" command
4. Select "Docker Compose File Support" as the formatter

**Keyboard Shortcut**: `Shift+Alt+F`

### Configuration
Add these settings to your VS Code preferences (`settings.json`) to customize:

```json
{
  "[docker-compose]": {
    "editor.defaultFormatter": "KilianJPopp.docker-compose-support",
    "editor.formatOnSave": true
  },
  "docker-compose.format.enabled": true
}
```

## Supported Files
- `docker-compose.yml`
- `docker-compose.yaml`
- `*.compose.yml`
- `*.compose.yaml`

## Requirements
- VS Code 1.60.0 or higher

## Extension Settings
This extension contributes the following settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `docker-compose.format.enabled` | Enable/disable formatting | `true` |
| `docker-compose.validation.enabled` | Enable/disable validation | `true` |

## Known Issues
- Limited support for Compose specification v3.8+ features

## Release Notes

### 1.0.0
Initial release with:
- Basic syntax highlighting
- Document formatting
- Simple validation

## Contributing
Contributions are welcome! Please open issues or pull requests at:  
https://github.com/Kilianjpo/docker-compose-support

## License
[BSD-3-Clause-Clear](https://github.com/Kilianjpo/docker-compose-file-support/blob/master/LICENSE)